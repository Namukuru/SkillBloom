from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, Skill, Badge, Review, SkillMatch
import json
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    skills = serializers.SlugRelatedField(
        queryset=Skill.objects.all(),
        slug_field="name",
        many=True,  # Allows multiple skills
    )

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "password", "skills", "proficiency"]

    def create(self, validated_data):
        skills_data = validated_data.pop("skills", [])
        validated_data["password"] = make_password(validated_data["password"])

        user = CustomUser.objects.create(**validated_data)
        user.skills.set(skills_data)  # Assign multiple skills
        return user


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ["name", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["reviewer", "comment", "rating"]


class UserProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    badges = BadgeSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)  # Include the reviews field

    class Meta:
        model = CustomUser
        fields = [
            "fullName",
            "proficiency",
            "skills",
            "badges",
            "reviews",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add fullName and email to token claims
        token["fullName"] = user.fullName
        token["email"] = user.email

        return token

class SkillMatchSerializer(serializers.ModelSerializer):
    teach_skill = SkillSerializer()
    learn_skill = SkillSerializer()
    user = CustomUserSerializer()

    class Meta:
        model = SkillMatch
        fields = ['id', 'user', 'teach_skill', 'learn_skill', 'is_completed', 'is_rated']
