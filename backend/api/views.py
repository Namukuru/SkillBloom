from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED

# skillmatch imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy


from .models import Skill, SkillMatch, CustomUser
from api.serializers import SkillSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})

# Function to generate JWT token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
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
    email = request.data.get("email")
    password = request.data.get("password")
    fullName = request.data.get("fullName")  # Match frontend field
    skills = request.data.get("skills", [])  # Expecting a list
    proficiency = request.data.get("proficiency", "beginner")  # Default value

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=HTTP_400_BAD_REQUEST)

    # Validate password strength
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({"error": e.messages}, status=HTTP_400_BAD_REQUEST)

    #  Create user
    user = CustomUser.objects.create_user(
        username=email,  # Set username as email
        email=email,
        fullName=fullName,
        password=password,
        proficiency=proficiency,
    )

    #  Assign skills using `.set()`
    if skills:
        skill_objs = Skill.objects.filter(name__in=skills)  # Ensure skills exist in DB
        user.skills.set(skill_objs)

    #  Generate authentication token
    token = get_tokens_for_user(user)

    return Response(
        {
            "token": token,
            "user": {"email": user.email, "fullName": user.fullName},
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
