from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from .filters import UserFilter
from .serializers import UserSerializer, PasswordSerializer, GroupSerializer
from .permissions import IsAdminOrSelf
User = get_user_model()



class EndPontViewSet(viewsets.ViewSet):
    pass


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrSelf,)
    model = User
    serializer_class = UserSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    
    queryset = User.objects.all()
    search_fields = ('email', 'first_name',)

    filter_class = UserFilter
    ordering_fields = ('email', 'first_name')

    @action()
    def set_password(self, request, pk=None):
        """
        To set a password, POST a `password` on the `/set_password/` url.
        To set a unusuable password, set `!` as a password.
        """
        user = self.get_object()
        serializer = PasswordSerializer(data=request.DATA)
        if serializer.is_valid():
            password = self.request.DATA['password']
            if password == '!':
                user.set_unusable_password()
            else:
                user.set_password(password)
                user.save()	
            return Response({'status': 'password set'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that represents a single or list of groups.
    """
    model = Group
    permission_classes = (IsAdminUser,)
    serializer_class = GroupSerializer