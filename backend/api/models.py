from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import User


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    PROFICIENCY_LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("expert", "Expert"),
    ]

    email = models.EmailField(unique=True)  # 🔹 Login with email instead of username
    fullName = models.CharField(
        max_length=255, blank=True, null=True
    )  # 🔹 Added full_name
    skills = models.ManyToManyField(Skill, blank=True)  # 🔹 Many-to-Many for skills
    credits = models.IntegerField(default=0)
    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_LEVELS,
        default="beginner",
    )
    xp_points = models.IntegerField(default=100)

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
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    teach_skill = models.ForeignKey(Skill, related_name="teachers", on_delete=models.CASCADE)
    learn_skill = models.ForeignKey(Skill, related_name="learners", on_delete=models.CASCADE)
    scheduled_date = models.DateTimeField()  # Add this field to store the scheduled date
    is_completed = models.BooleanField(default=False)  # Track session completion
    is_rated = models.BooleanField(default=False)  # Track if the session is rated

    def __str__(self):
        return f"{self.user.username} teaches {self.teach_skill} and learns {self.learn_skill}"
    
class Badge(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="badges/")
    users = models.ManyToManyField(CustomUser, related_name="badges", blank=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="given_reviews")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reviews")
    comment = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        return f"Review by {self.reviewer} for {self.user}"   

class Rating(models.Model):
    skill_match = models.ForeignKey(SkillMatch, on_delete=models.CASCADE, related_name="ratings")
    learner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="given_ratings")
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_ratings")
    rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])  # Rating from 1 to 5
    feedback = models.TextField(blank=True, null=True)  # Optional feedback
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.learner.email} rated {self.teacher.email} {self.rating}"
