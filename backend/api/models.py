from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class SkillMatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    teach_skill = models.CharField(max_length=255)
    learn_skill = models.CharField(max_length=255)
