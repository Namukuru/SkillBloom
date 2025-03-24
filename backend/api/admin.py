from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Skill, SkillMatch, CustomUser

class SkillAdmin(admin.ModelAdmin):
    search_fields = ('name',)  # Allow searching by skill name
    ordering = ('name',)  # Order skills by name
    list_display = ('name', 'description', 'created_at')  # Fields from the Skill model

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("email", "fullName", "proficiency","get_skills","credits")  # Show basic user details
    search_fields = ("email", "fullName")  # Enable searching by email & name
    ordering = ("email",)  # Order by email
    
    def get_skills(self, obj):
        return ", ".join([skill.name for skill in obj.skills.all()])

    get_skills.short_description = 'Skills'  # Optional: Rename column in admin panel

    
admin.site.register(Skill, SkillAdmin)
admin.site.register(SkillMatch)
admin.site.register(CustomUser, CustomUserAdmin)
