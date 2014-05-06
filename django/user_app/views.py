from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework import generics

from .filters import UserFilter
from .serializers import UserSerializer, PasswordSerializer, GroupSerializer
from .permissions import IsAdminOrSelf

User = get_user_model()

class UserViewSet(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminOrSelf,)
    model = User
    serializer_class = UserSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,
                        )


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that represents a single or list of groups.
    """
    model = Group
    permission_classes = (IsAdminUser,)
    serializer_class = GroupSerializer