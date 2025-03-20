from django.urls import path
from .views import (
    find_match,
    get_skills,
    hello_world,
    login_view,
    register_view,
    logout_view,
    UserProfileView,
    send_sms,
    about_view,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("hello/", hello_world),
    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
    path("find_match/", find_match, name="find_match"),
    path("skills/", get_skills, name="get_skills"),
    path("logout/", logout_view, name="logout"),
    path("send_sms/", send_sms, name="send_sms"),
    path("about/", about_view, name="about"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", UserProfileView.as_view(), name="user_profile_api"),
]
