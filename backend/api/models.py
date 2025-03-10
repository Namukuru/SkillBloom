from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import User


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    PROFICIENCY_LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("expert", "Expert"),
    ]

    email = models.EmailField(unique=True)  # 🔹 Login with email instead of username
    full_name = models.CharField(
        max_length=255, blank=True, null=True
    )  # 🔹 Added full_name
    skills = models.ManyToManyField(Skill, blank=True)  # 🔹 Many-to-Many for skills
    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_LEVELS,
        default="beginner",
    )

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_users_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_users_permissions",
        blank=True,
    )

    USERNAME_FIELD = "email"  # 🔹 Email is the unique identifier
    REQUIRED_FIELDS = ["username"]  # 🔹 Keep username required if needed

    def __str__(self):
        return self.email  # 🔹 Display email as the default representation


class SkillMatch(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Fix
    teach_skill = models.ForeignKey(
        Skill, related_name="teachers", on_delete=models.CASCADE
    )
    learn_skill = models.ForeignKey(
        Skill, related_name="learners", on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.user.username} teaches {self.teach_skill} and learns {self.learn_skill}"
