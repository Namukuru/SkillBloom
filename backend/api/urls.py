from django.urls import path
from .views import hello_world,login_view, register_view

urlpatterns = [
    path('hello/', hello_world),
    path('api/login/', login_view, name='login'),
    path('api/register/', register_view, name='register'),
]
