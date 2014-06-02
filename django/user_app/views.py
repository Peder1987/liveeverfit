from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import generics

from .filters import UserFilter, GenderFilterBackend, ProfessionFilterBackend, LocationFilterBackend, AcceptingFilterBackend, TagFilterBackend
from .filters import OwnerFilterBackend, QueueFilterBackend
from .serializers import SettingsSerializer, PasswordSerializer, GroupSerializer, ProfessionalListSerializer, LocationSerializer, ClientListSerializer
from .serializers import PaymentSerializer, ModifyMembershipSerializer, CreditcardSerializer, SettingsProfessionalSerializer, ProfileSerializer, UserLikeSerializer
from .serializers import FollowUserSerializer, ConnectUserSerializer, RelationshipTypeAheadSerializer
from .permissions import IsAdminOrSelf, IsOwnerOrReadOnly, AuthenticatedReadOnly
from .models import Professional, UniqueLocation



class UserViewSet(generics.RetrieveUpdateDestroyAPIView):
    model = User
    permission_classes = (IsAdminOrSelf,)
    serializer_class = SettingsSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)

class ProfileView(generics.RetrieveAPIView):
    model = User
    permission_classes = (AuthenticatedReadOnly,)
    serializer_class = ProfileSerializer
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
    filter_backends = (GenderFilterBackend,ProfessionFilterBackend,LocationFilterBackend,AcceptingFilterBackend, TagFilterBackend, QueueFilterBackend)

    def get_queryset(self):
        return Professional.objects.all()


class ProfessionalObjView(generics.RetrieveUpdateDestroyAPIView):
    model = Professional
    serializer_class = SettingsProfessionalSerializer
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


class ModifyMembershipView(generics.RetrieveAPIView):
    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifyMembershipSerializer
    

class PaymentView(generics.RetrieveUpdateDestroyAPIView):
    model = User
    permission_classes = (IsAdminOrSelf,)
    serializer_class = PaymentSerializer
    
class UserLikeView(generics.UpdateAPIView, generics.DestroyAPIView):
    model = User
    permission_classes = (IsAdminOrSelf,)
    serializer_class = UserLikeSerializer

class FollowUserView(generics.UpdateAPIView):
    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowUserSerializer


class ConnectUserView(generics.UpdateAPIView):
    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = ConnectUserSerializer


class RelationshipTypeAheadView(generics.ListAPIView):
    paginate_by = None
    serializer_class = RelationshipTypeAheadSerializer
    model = User
    permission_classes = (IsAuthenticated,)
    #search_fields = ('title', )

    def get_queryset(self):
        user =  self.request.user
        qs = user.relationships.followers()
        qs2 = user.relationships.following()
        qs3 = qs | qs2
 
        return qs3.distinct()
        

        