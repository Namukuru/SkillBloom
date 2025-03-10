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

from api.models import Skill, SkillMatch
from api.serializers import SkillSerializer


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


@api_view(["GET"])
def get_skills(request):
    skills = Skill.objects.all()
    serializer = SkillSerializer(skills, many=True)
    return Response({"skills": serializer.data})


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

    # Prepare skill dataset for vectorization
    skills = [f"{obj.teach_skill} {obj.learn_skill}" for obj in skill_matches]
    user_input = f"{teach_skill} {learn_skill}"

    # Initialize vectorizer & fit only on known skills
    vectorizer = TfidfVectorizer()
    skill_vectors = vectorizer.fit_transform(skills)
    user_vector = vectorizer.transform([user_input])
    # Compute similarity scores
    similarity_scores = cosine_similarity(user_vector, skill_vectors)[0]

    # Debugging output
    print("User Input:", user_input)
    print("Skill List:", skills)
    print("Similarity Scores:", similarity_scores)

    if similarity_scores.max() > 0.5:  # Ensure threshold is met
        best_match_index = similarity_scores.argmax()
        best_match = skill_matches[best_match_index]

        print(
            f"Best Match: {best_match.user.username} with score {similarity_scores[best_match_index]}"
        )

        return Response(
            {
                "match": {
                    "name": best_match.user.username,
                    "skill": best_match.teach_skill,
                    "score": similarity_scores[best_match_index],
                }
            }
        )

    return Response(
        {
            "match": None,
            "message": "No suitable match found",
            "scores": list(similarity_scores),
        }
    )
