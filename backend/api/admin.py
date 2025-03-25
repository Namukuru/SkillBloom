from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Skill, ScheduledSession, CustomUser


class SkillAdmin(admin.ModelAdmin):
    search_fields = ("name",)  # Allow searching by skill name
    ordering = ("name",)  # Order skills by name
    list_display = ("name", "description", "created_at")  # Fields from the Skill model


class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "fullName",
        "proficiency",
        "get_skills",
        "credits",
    )  # Show basic user details
    search_fields = ("email", "fullName")  # Enable searching by email & name
    ordering = ("email",)  # Order by email

    def get_skills(self, obj):
        return ", ".join([skill.name for skill in obj.skills.all()])

    get_skills.short_description = "Skills"  # Optional: Rename column in admin panel

@admin.register(ScheduledSession)
class ScheduledSessionAdmin(admin.ModelAdmin):
    # Display fields in list view
    list_display = (
        'id',
        'user',
        'teach_skill',
        'learn_skill',
        'scheduled_date',
        'is_completed',
        'is_rated',
    )
    
    # Make list view filterable
    list_filter = (
        'is_completed',
        'is_rated',
        'teach_skill',
        'learn_skill',
        'scheduled_date',
    )
    
    # Add search functionality
    search_fields = (
        'user__username',
        'user__email',
        'teach_skill__name',
        'learn_skill__name',
    )
    
    # Fields to display in edit/create form
    fieldsets = (
        (None, {
            'fields': ('user', 'teach_skill', 'learn_skill')
        }),
        ('Scheduling', {
            'fields': ('scheduled_date',)
        }),
        ('Status', {
            'fields': ('is_completed', 'is_rated')
        }),
    )
    
    # Raw ID fields for better performance with many users/skills
    raw_id_fields = ('user', 'teach_skill', 'learn_skill')
    
    # Date-based navigation
    date_hierarchy = 'scheduled_date'
    
    # Default ordering
    ordering = ('-scheduled_date',)
    
    # Customize the user display
    def user_info(self, obj):
        return f"{obj.user.username} ({obj.user.email})"
    user_info.short_description = 'User'
    
    # Action to mark sessions as completed
    actions = ['mark_as_completed']
    
    def mark_as_completed(self, request, queryset):
        queryset.update(is_completed=True)
    mark_as_completed.short_description = "Mark selected sessions as completed"

admin.site.register(Skill, SkillAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
