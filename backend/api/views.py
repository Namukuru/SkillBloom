from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# skillmatch imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

from backend.api.models import SkillMatch


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
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    token = get_tokens_for_user(user)

    return Response({"token": token, "user": {"username": user.username}})


# Load NLP model
nlp = spacy.load("en_core_web_md")


@api_view(["POST"])
def find_match(request):
    teach_skill = request.data.get("teach_skill")
    learn_skill = request.data.get("learn_skill")

    if not teach_skill or not learn_skill:
        return Response({"error": "Both skills are required"}, status=400)

    # Retrieve all users and their skills
    skill_matches = SkillMatch.objects.all()

    if not skill_matches.exists():
        return Response({"match": None, "message": "No matches found"})

    # Prepare data for similarity matching
    skills = [f"{obj.teach_skill} {obj.learn_skill}" for obj in skill_matches]
    user_input = f"{teach_skill} {learn_skill}"

    # Use TF-IDF for vectorization
    vectorizer = TfidfVectorizer()
    skill_vectors = vectorizer.fit_transform(skills + [user_input])

    # Compute similarity scores
    similarity_scores = cosine_similarity(skill_vectors[-1], skill_vectors[:-1])

    # Find best match
    best_match_index = similarity_scores.argmax()
    best_match_score = similarity_scores[0][best_match_index]

    if best_match_score > 0.5:  # Threshold for a valid match
        matched_user = skill_matches[best_match_index].user
        return Response(
            {
                "match": {
                    "name": matched_user.username,
                    "skill": skill_matches[best_match_index].teach_skill,
                }
            }
        )
    else:
        return Response({"match": None, "message": "No suitable match found"})
