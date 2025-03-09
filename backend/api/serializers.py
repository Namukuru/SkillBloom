from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, Skill


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "password", "skills", "proficiency"]

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"
