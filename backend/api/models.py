from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    PROFICIENCY_LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("expert", "Expert"),
    ]

    email = models.EmailField(unique=True)
    fullName = models.CharField(max_length=255, blank=True, null=True)
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

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    teachers = models.ManyToManyField(
        CustomUser, related_name="skills_teaching", blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Add this after Skill is defined to resolve circular reference
CustomUser.add_to_class(
    "skills", models.ManyToManyField(Skill, related_name="users_with_skill", blank=True)
)


class ScheduledSession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    teach_skill = models.ForeignKey(
        Skill, related_name="teaching_sessions", on_delete=models.CASCADE
    )
    learn_skill = models.ForeignKey(
        Skill, related_name="learning_sessions", on_delete=models.CASCADE
    )
    scheduled_date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    is_rated = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} teaches {self.teach_skill} and learns {self.learn_skill}"


class Badge(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="badges/")
    users = models.ManyToManyField(CustomUser, related_name="badges", blank=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    reviewer = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="given_reviews"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reviews"
    )
    comment = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        return f"Review by {self.reviewer} for {self.user}"


class Rating(models.Model):
    skill_match = models.ForeignKey(
        ScheduledSession, on_delete=models.CASCADE, related_name="ratings"
    )
    learner = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="given_ratings"
    )
    teacher = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="received_ratings"
    )
    rating = models.IntegerField(
        choices=[(1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")]
    )
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.learner.email} rated {self.teacher.email} {self.rating}"
