from django.shortcuts import render

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Role
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, RoleSerializer, AssignRoleSerializer
from .permissions import admin_required, manager_required

@extend_schema(request=UserRegistrationSerializer)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(request=UserLoginSerializer)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses=UserSerializer)
@api_view(['GET'])
def profile(request):
    return Response(UserSerializer(request.user).data)

@admin_required
class RoleListCreateView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

@admin_required
class RoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

@manager_required
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@admin_required
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Примеры защищенных эндпоинтов
@api_view(['GET'])
@admin_required
def admin_only_endpoint(request):
    return Response({'message': 'Только для администраторов'})

@api_view(['GET'])
@manager_required
def manager_endpoint(request):
    return Response({'message': 'Для менеджеров и выше'})

# Эндпоинт для назначения роли (без ограничений для тестирования)
@extend_schema(request=AssignRoleSerializer)
@api_view(['POST'])
@permission_classes([AllowAny])
def assign_role(request):
    user_id = request.data.get('user_id')
    role_id = request.data.get('role_id')
    
    try:
        user = User.objects.get(id=user_id)
        role = Role.objects.get(id=role_id)
        user.role = role
        user.save()
        return Response({'message': f'Роль {role.name} назначена пользователю {user.username}'})
    except (User.DoesNotExist, Role.DoesNotExist):
        return Response({'error': 'Пользователь или роль не найдены'}, status=400)
