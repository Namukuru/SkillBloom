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
    XPTransactionViewSet,
    complete_session,
    rate_teacher,
    scheduled_sessions,
    user_sessions,
    home_view,
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
    path("home/", home_view, name="home"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", UserProfileView.as_view(), name="user_profile_api"),
    path("xp/", XPTransactionViewSet.as_view({"get": "list"}), name="xp_transactions"),
    path(
        "complete-session/<int:skill_match_id>/",
        complete_session,
        name="complete_session",
    ),
    path("rate-teacher/<int:skill_match_id>/", rate_teacher, name="rate_teacher"),
    path("scheduled-sessions/", scheduled_sessions, name="scheduled_sessions"),
    path("sessions/", user_sessions, name="user_sessions"),
]
