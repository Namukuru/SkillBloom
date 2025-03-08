from django.contrib.auth.models import AbstractUser
from django.db import models

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    PROFICIENCY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]

    skills = models.ManyToManyField(Skill, blank=True)  # Many-to-Many for skills
    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_LEVELS,  # Restricts input to valid choices
        default='beginner'
    )

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_users_groups",  # Fix conflict
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_users_permissions",  # Fix conflict
        blank=True
    )
