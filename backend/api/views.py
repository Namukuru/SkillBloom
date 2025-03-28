from venv import logger
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from django.db import models


# skillmatch imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

from backend import settings
from backend.settings import AFRICASTALKING_API_KEY, AFRICASTALKING_USERNAME
from .models import Skill, CustomUser, ScheduledSession, Rating
from api.serializers import SkillSerializer, UserProfileSerializer, SkillMatchSerializer
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


def home_view(request):
    data = {
        "title": "Welcome to SkillBloom",
        "description": "Join SkillBloom to learn new skills, teach what you know, and connect with a global community of learners and professionals.",
        "features": ["Global Community", "Skill Exchange", "Personal Growth"],
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
    # Get data from request
    email = request.data.get("email")
    password = request.data.get("password")
    fullName = request.data.get("fullName")  # Match frontend field
    skill_names = request.data.get("skill_names", [])  # Expecting a list of skill names
    proficiency = request.data.get("proficiency", "beginner")

    # Validation
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

    # Create user
    user = CustomUser.objects.create_user(
        username=email,
        email=email,
        fullName=fullName,
        password=password,
        proficiency=proficiency,
    )

    # Process skills - create if they don't exist
    for skill_name in skill_names:
        skill, created = Skill.objects.get_or_create(name=skill_name)
        user.skills.add(skill)

    # Generate token
    token = get_tokens_for_user(user)

    return Response(
        {
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "fullName": user.fullName,
                "skills": list(user.skills.values_list("name", flat=True)),
                "proficiency": user.proficiency,
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
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Ensure this is the logged-in user
        print("User:", user.email)  # Debugging output
        print("Authenticated:", user.is_authenticated)

        if not user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=401)

        serializer = UserProfileSerializer(user, many=False)  # Serialize single user
        return Response(serializer.data)


API_KEY = AFRICASTALKING_API_KEY
USERNAME = AFRICASTALKING_USERNAME
SMS_URL = "https://api.africastalking.com/version1/messaging"


@csrf_exempt
def send_sms(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validate required fields
            required_fields = [
                "phone_number",
                "skill_name",
                "scheduled_date",
                "student",
            ]
            missing_fields = [f for f in required_fields if not data.get(f)]
            if missing_fields:
                return JsonResponse(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=400,
                )

            # Get teacher info from your API
            match_response = requests.post(
                "http://127.0.0.1:8000/api/find_match/",
                json={"learn": data["skill_name"]},
                headers={"Content-Type": "application/json"},
                timeout=10,
            )

            if match_response.status_code != 200:
                return JsonResponse(
                    {"error": "Teacher matching service unavailable"}, status=503
                )

            match_data = match_response.json().get("match")
            if not match_data:
                return JsonResponse(
                    {"error": "No available teachers for this skill"}, status=404
                )

            # Format SMS message
            message = (
                f"Hello {data['student']},\n\n"
                f"Your {data['skill_name']} session with {match_data.get('name', 'our teacher')} "
                f"is confirmed for {data['scheduled_date']}.\n\n"
                "Thank you for using SkillBloom!"
            )

            # Send SMS via Africa’s Talking API
            sms_response = requests.post(
                SMS_URL,
                data={
                    "username": USERNAME,
                    "to": data["phone_number"],
                    "message": message[:160],  # Truncate to 160 characters
                },
                headers={
                    "apiKey": API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                timeout=10,
            )

            # Check response from SMS provider
            if sms_response.status_code == 201:
                return JsonResponse(
                    {"status": "success", "message": "SMS sent successfully!"}
                )
            else:
                return JsonResponse(
                    {"error": f"SMS provider error: {sms_response.text}"}, status=500
                )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except requests.Timeout:
            return JsonResponse({"error": "Service timeout"}, status=504)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


User = get_user_model()


class XPTransactionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["POST"])
    def transfer_xp(self, request):
        sender = request.user
        recipient_username = request.data.get("recipient")
        amount = int(request.data.get("amount", 0))

        if amount <= 0 or sender.xp < amount:
            return Response(
                {"error": "Insufficient XP or invalid amount"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            recipient = User.objects.get(username=recipient_username)
        except User.DoesNotExist:
            return Response(
                {"error": "Recipient not found"}, status=status.HTTP_404_NOT_FOUND
            )

        sender.xp -= amount
        recipient.xp += amount
        sender.save()
        recipient.save()

        return Response({"message": f"Transferred {amount} XP to {recipient_username}"})


@api_view(["POST"])
def complete_session(request, skill_match_id):
    skill_match = ScheduledSession.objects.get(id=skill_match_id)
    if not skill_match.is_completed:
        skill_match.is_completed = True
        skill_match.save()
        return Response({"message": "Session marked as completed."})
    return Response({"message": "Session already completed."})


@api_view(["POST"])
def rate_teacher(request, skill_match_id):
    skill_match = ScheduledSession.objects.get(id=skill_match_id)
    if skill_match.is_completed and not skill_match.is_rated:
        rating = request.data.get("rating")
        feedback = request.data.get("feedback", "")

        # Create the rating
        Rating.objects.create(
            skill_match=skill_match,
            learner=skill_match.user,  # Learner is the user who requested the session
            teacher=skill_match.teach_skill.user,  # Teacher is the user offering the skill
            rating=rating,
            feedback=feedback,
        )

        # Allocate credits to the teacher based on the rating
        teacher = skill_match.teach_skill.user
        teacher.credits += rating  # Give credits equal to the rating (e.g., 5 credits for a 5-star rating)
        teacher.save()

        skill_match.is_rated = True
        skill_match.save()

        return Response({"message": "Teacher rated successfully!"})
    return Response({"message": "Session not completed or already rated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure user is logged in
def scheduled_sessions(request):
    try:
        # Get data from request body
        user_id = request.data.get("user_id")
        teacher_id = request.data.get("teacher_id")
        learn_skill_name = request.data.get("learn_skill")
        scheduled_date = request.data.get("scheduled_date")

        # Validate required fields
        if not (user_id and teacher_id and learn_skill_name and scheduled_date):
            return JsonResponse(
                {"status": "error", "message": "Missing required fields"},
                status=400,
            )

        # Fetch user and teacher
        try:
            user = CustomUser.objects.get(id=user_id)
            teacher = CustomUser.objects.get(id=teacher_id)
        except CustomUser.DoesNotExist:
            return JsonResponse(
                {"status": "error", "message": "User or Teacher not found"},
                status=404,
            )

        # Fetch skill object (assuming `Skill` model has `name` field)
        try:
            learn_skill = Skill.objects.get(name=learn_skill_name)
        except Skill.DoesNotExist:
            return JsonResponse(
                {"status": "error", "message": "Learn skill not found"},
                status=404,
            )

        # Create and save the session
        session = ScheduledSession.objects.create(
            user=user,
            teach_skill=learn_skill,  # Assuming teach_skill is the skill being taught
            learn_skill=learn_skill,
            scheduled_date=scheduled_date,
            is_completed=False,
            is_rated=False,
        )

        return JsonResponse(
            {
                "status": "success",
                "message": "Session created successfully",
                "session_id": session.id,
            }
        )

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_sessions(request):
    user = request.user

    try:
        # Get sessions where user is either the student or teacher
        sessions = (
            ScheduledSession.objects.filter(
                models.Q(user=user) | models.Q(teach_skill__teachers=user)
            )
            .select_related("user", "teach_skill", "learn_skill")
            .prefetch_related("teach_skill__teachers")
            .order_by("-scheduled_date")
            .distinct()
        )

        response_data = {"success": True, "sessions": [], "count": sessions.count()}

        for session in sessions:
            # Get all teacher IDs for this session's teach_skill
            teacher_ids = list(
                session.teach_skill.teachers.values_list("id", flat=True)
            )
            is_teacher = user.id in teacher_ids

            # Determine counterpart information
            if is_teacher:
                counterpart = {
                    "id": session.user.id,
                    "fullName": session.user.fullName,
                    "email": session.user.email,
                }
                role = "teacher"
            else:
                first_teacher = session.teach_skill.teachers.first()
                counterpart = {
                    "id": first_teacher.id if first_teacher else None,
                    "fullName": (
                        first_teacher.fullName if first_teacher else "Unknown Teacher"
                    ),
                    "email": first_teacher.email if first_teacher else "",
                }
                role = "student"

            session_data = {
                "id": session.id,
                "teach_skill": session.teach_skill.name,
                "learn_skill": session.learn_skill.name,
                "role": role,
                "counterpart": counterpart,
                "scheduled_date": session.scheduled_date.isoformat(),
                "status": "completed" if session.is_completed else "pending",
                "is_rated": session.is_rated,
            }
            response_data["sessions"].append(session_data)

        return Response(response_data)

    except Exception as e:
        logger.error(
            f"Error fetching sessions for user {user.id}: {str(e)}", exc_info=True
        )
        return Response(
            {"success": False, "message": "Error fetching sessions", "error": str(e)},
            status=500,
        )
