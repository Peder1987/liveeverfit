from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import generics

from .filters import UserFilter, GenderFilterBackend, ProfessionFilterBackend, LocationFilterBackend, AcceptingFilterBackend, TagFilterBackend
from .serializers import UserSerializer, PasswordSerializer, GroupSerializer, ProfessionalSerializer, LocationSerializer
from .permissions import IsAdminOrSelf
from .models import Professional, UniqueLocation



class UserViewSet(generics.RetrieveUpdateDestroyAPIView):
    model = User
    permission_classes = (IsAdminOrSelf,)
    serializer_class = UserSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)


class GroupViewSet(viewsets.ModelViewSet):
    model = Group
    permission_classes = (IsAdminUser,)
    serializer_class = GroupSerializer


class LocationViewSet(viewsets.ModelViewSet):
    model = UniqueLocation
    permission_classes = (IsAuthenticated,)
    serializer_class = LocationSerializer


class ProfessionalViewSet(viewsets.ModelViewSet):
    paginate_by = 9
    model = Professional
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfessionalSerializer
    filter_backends = (GenderFilterBackend,ProfessionFilterBackend,LocationFilterBackend,AcceptingFilterBackend, TagFilterBackend)

    def get_queryset(self):
        return Professional.objects.all()