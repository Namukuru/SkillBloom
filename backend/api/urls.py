from django.urls import path
from .views import find_match, get_skills, hello_world, login_view, register_view, logout_view, UserProfileView

urlpatterns = [
    path("hello/", hello_world),
    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
    path("find_match/", find_match, name="find_match"),
    path("skills/", get_skills, name="get_skills"),
    path("logout/", logout_view, name="logout"),
    path('api/profile/', UserProfileView.as_view(), name='user_profile_api'),
]
