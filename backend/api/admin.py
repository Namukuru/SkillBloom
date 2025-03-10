from django.contrib import admin
from .models import Skill, SkillMatch

# Register your models here.
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
    
admin.site.register(Skill, SkillAdmin)
admin.site.register(SkillMatch)
