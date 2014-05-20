from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import generics

from .filters import UserFilter, GenderFilterBackend, ProfessionFilterBackend, LocationFilterBackend, AcceptingFilterBackend, TagFilterBackend
from .filters import OwnerFilterBackend
from .serializers import UserSerializer, PasswordSerializer, GroupSerializer, ProfessionalListSerializer, LocationSerializer, ClientListSerializer
from .serializers import PaymentSerializer, ModifyMembershipSerializer, CreditcardSerializer
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


class ProfessionalListView(generics.ListAPIView):
    paginate_by = 9
    model = Professional
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfessionalListSerializer
    filter_backends = (GenderFilterBackend,ProfessionFilterBackend,LocationFilterBackend,AcceptingFilterBackend, TagFilterBackend)

    def get_queryset(self):
        return Professional.objects.all()


class ProfessionalObjView(generics.RetrieveUpdateDestroyAPIView):
    model = Professional
    permission_classes = (IsAdminOrSelf,)
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)

class CreditcardView(generics.RetrieveAPIView):
    model = User
    permission_classes= (IsAdminOrSelf,)
    serializer_class = CreditcardSerializer
    #filter_backends =

class ClientListView(generics.ListAPIView):
    paginate_by = None
    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = ClientListSerializer
    filter_backends = (OwnerFilterBackend, filters.SearchFilter,)
    search_fields = ('email', 'first_name', 'last_name')



    

class ModifyMembershipView(generics.RetrieveUpdateDestroyAPIView):
    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifyMembershipSerializer
    

class PaymentView(generics.RetrieveUpdateDestroyAPIView):
    model = User
    permission_classes = (IsAdminOrSelf,)
    serializer_class = PaymentSerializer
    