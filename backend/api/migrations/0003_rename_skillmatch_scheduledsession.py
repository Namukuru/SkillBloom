# Generated by Django 5.1.7 on 2025-03-25 07:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_customuser_credits_skill_created_at_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='SkillMatch',
            new_name='ScheduledSession',
        ),
    ]
