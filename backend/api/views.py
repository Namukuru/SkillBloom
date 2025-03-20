from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json

# skillmatch imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

from backend.settings import AFRICASTALKING_API_KEY, AFRICASTALKING_USERNAME
from .models import Skill, CustomUser
from api.serializers import SkillSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


def about_view(request):
    data = {
        "title": "Skill Swap",
        "description": "A platform for exchanging skills with others.",
        "version": "1.0.0",
    }
    return JsonResponse(data)


# Function to generate JWT token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["fullName"] = user.fullName
    refresh["email"] = user.email

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "email": user.email,
            "fullName": user.fullName,
        },
    }


@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user is not None:
        token = get_tokens_for_user(user)
        return Response({"token": token, "user": {"username": user.username}})
    else:
        return Response({"error": "Invalid credentials"}, status=400)


@api_view(["POST"])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the token to invalidate it

        return Response({"message": "Successfully logged out"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def register_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    fullName = request.data.get("fullName")  # Match frontend field
    skills = request.data.get("skills", [])  # Expecting a list
    proficiency = request.data.get("proficiency", "beginner")  # Default value

    if not email or not password:
        return Response(
            {"error": "Email and password are required"}, status=HTTP_400_BAD_REQUEST
        )

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=HTTP_400_BAD_REQUEST)

    try:
        validate_password(password)
    except ValidationError as e:
        return Response({"error": e.messages}, status=HTTP_400_BAD_REQUEST)

    # ✅ Create user
    user = CustomUser.objects.create_user(
        username=email,
        email=email,
        fullName=fullName,
        password=password,
        proficiency=proficiency,
    )

    # ✅ Assign skills
    if skills:
        skill_objs = Skill.objects.filter(name__in=skills)
        user.skills.set(skill_objs)

    # ✅ Generate token
    token = get_tokens_for_user(user)

    return Response(
        {
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "fullName": user.fullName,
            },
        },
        status=HTTP_201_CREATED,
    )


@api_view(["GET"])
def get_skills(request):
    skills = Skill.objects.all()
    serializer = SkillSerializer(skills, many=True)
    return Response({"skills": serializer.data})


# Load NLP model for similarity comparison
nlp = spacy.load("en_core_web_md")


@api_view(["POST"])
def find_match(request):
    learn_skill_name = request.data.get("learn")  # User wants to learn this skill

    if not learn_skill_name:
        return Response({"error": "Skill to learn is required"}, status=400)

    # 🔹 Check if the requested skill exists in the database
    learn_skill = Skill.objects.filter(name__iexact=learn_skill_name).first()
    if not learn_skill:
        return Response(
            {"match": None, "message": "No such skill found in the database"}
        )

    # 🔹 Get users who have this skill
    potential_teachers = CustomUser.objects.filter(skills=learn_skill)

    if not potential_teachers.exists():
        return Response({"match": None, "message": "No users found with this skill"})

    # 🔹 AI Matching: Compare similarity using NLP
    best_match = None
    highest_similarity = 0.0

    user_learn_doc = nlp(learn_skill.name)

    for teacher in potential_teachers:
        for skill in teacher.skills.all():
            teach_doc = nlp(skill.name)
            similarity = user_learn_doc.similarity(teach_doc)  # NLP similarity score

            if similarity > highest_similarity:
                highest_similarity = similarity
                best_match = teacher

    if best_match:
        return Response(
            {
                "match": {
                    "id": best_match.id,
                    "name": best_match.fullName or best_match.email,
                    "teaches": learn_skill.name,
                    "proficiency": best_match.proficiency,
                    "similarity_score": round(highest_similarity, 2),
                }
            }
        )

    return Response({"match": None, "message": "No suitable match found"})


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)


API_KEY = AFRICASTALKING_API_KEY
USERNAME = AFRICASTALKING_USERNAME
SMS_URL = "https://api.africastalking.com/version1/messaging"


@csrf_exempt
def send_sms(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            phone_number = data.get("phone_number")
            skill_name = data.get("skill_name")
            scheduled_date = data.get("scheduled_date")
            student = data.get("student")

            if not phone_number or not skill_name or not scheduled_date or not student:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            # 🔍 Call `find_match` API to get the teacher
            match_response = requests.post(
                "http://127.0.0.1:8000/api/find_match/",
                json={"learn": skill_name},
                headers={"Content-Type": "application/json"},
            )

            if match_response.status_code != 200:
                return JsonResponse(
                    {"error": f"find_match API failed: {match_response.text}"},
                    status=500,
                )

            match_data = match_response.json().get("match")
            if not match_data:
                return JsonResponse({"error": "No match found"}, status=404)

            teacher_name = match_data.get("name", "Unknown Teacher")

            message = f"Hello {student}, your Skillbloom session for {skill_name} with {teacher_name} has been scheduled for {scheduled_date}. Thank you!"

            # 📡 Send SMS
            sms_response = requests.post(
                SMS_URL,
                data={"username": USERNAME, "to": phone_number, "message": message},
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "apiKey": API_KEY,
                },
            )

            return JsonResponse(sms_response.json(), status=sms_response.status_code)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
