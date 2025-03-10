from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

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
def register_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    full_name = request.data.get("full_name")
    skills = request.data.get("skills", [])  # Expecting a list of skill names

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    # Create user
    user = CustomUser.objects.create_user(
        email=email,
        password=password,
        full_name=full_name,
        username=email,
    )

    # Assign skills to user
    for skill_name in skills:
        skill, created = Skill.objects.get_or_create(name=skill_name)
        user.skills.add(skill)

    user.save()
    return Response({"message": "User registered successfully", "user_id": user.id})

    full_name = request.data.get("fullName")  # Match frontend field
    email = request.data.get("email")
    password = request.data.get("password")
    skills = request.data.get("skills", [])  # Expecting a list
    proficiency = request.data.get("proficiency", "beginner")  # Default value

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    # Create user
    user = CustomUser.objects.create_user(
        username=email,  # Set username as email (or generate one)
        email=email,
        full_name=full_name,
        password=password,
        proficiency=proficiency,
    )

    # Assign skills using `.set()`
    if skills:
        skill_objs = Skill.objects.filter(name__in=skills)  # Match skill name
        user.skills.set(skill_objs)  # ✅ Correct way to assign ManyToManyField

    token = get_tokens_for_user(user)

    return Response(
        {"token": token, "user": {"email": user.email, "full_name": user.full_name}}
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
                    "name": best_match.full_name or best_match.email,
                    "teaches": learn_skill.name,
                    "proficiency": best_match.proficiency,
                    "similarity_score": round(highest_similarity, 2),
                }
            }
        )

    return Response({"match": None, "message": "No suitable match found"})
