from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Skill, SkillMatch, CustomUser

# Register your models here.
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

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
