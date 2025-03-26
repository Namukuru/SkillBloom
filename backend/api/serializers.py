from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, Skill, Badge, Review, ScheduledSession
import json
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    skill_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=True
    )
    full_name = serializers.CharField(source="fullName", required=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "password",
            "full_name",
            "skill_names",
            "proficiency",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }
        fields = [
            "id",
            "username",
            "email",
            "password",
            "skills",
            "proficiency",
            "xp_points",
            "badges",
        ]

    def create(self, validated_data):
        # Extract skill names
        skill_names = validated_data.pop("skill_names", [])

        # Hash password
        validated_data["password"] = make_password(validated_data["password"])

        # Create user
        user = CustomUser.objects.create(**validated_data)

        # Add skills
        for skill_name in skill_names:
            skill, created = Skill.objects.get_or_create(name=skill_name)
            user.skills.add(skill)

        return user

    def to_representation(self, instance):
        """Custom representation to include skill names in response"""
        representation = super().to_representation(instance)
        representation["skills"] = [skill.name for skill in instance.skills.all()]
        return representation


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ["name", "image"]

        fields = ["name", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["reviewer", "comment", "rating"]

        fields = ["reviewer", "comment", "rating"]


class UserProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    badges = BadgeSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)  # Include the reviews field
    xp_points = serializers.SerializerMethodField()

    def get_xp_points(self, obj):
        return obj.xp_points

    def get_badges(self, obj):
        return [badge.name for badge in obj.badges.all()]

    class Meta:
        model = CustomUser
        fields = [
            "fullName",
            "proficiency",
            "skills",
            "email",
            "badges",
            "reviews",
            "xp_points",
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
    teach_skill = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all()
    )  # Expect skill ID
    learn_skill = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all()
    )  # Expect skill ID
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )  # Expect user ID

    class Meta:
        model = ScheduledSession
        fields = [
            "id",
            "user",
            "teach_skill",
            "learn_skill",
            "scheduled_date",  # Add this field
            "is_completed",
            "is_rated",
        ]
