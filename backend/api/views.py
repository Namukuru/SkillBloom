from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

# Function to generate JWT token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        token = get_tokens_for_user(user)
        return Response({'token': token, 'user': {'username': user.username}})
    else:
        return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    user = User.objects.create_user(username=username, password=password)
    token = get_tokens_for_user(user)
    
    return Response({'token': token, 'user': {'username': user.username}})