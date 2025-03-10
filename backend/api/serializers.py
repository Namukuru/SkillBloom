from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, Skill
import json


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    skills = serializers.SlugRelatedField(
        queryset=Skill.objects.all(),
        slug_field="name",
        many=True  # Allows multiple skills
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
