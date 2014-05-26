#Django Libs
from django.core.mail import send_mail
from django.contrib.auth import authenticate
#Rest Framework
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers
#Serializers
from .serializers import ContactSerializer
#Permissions
from .permissions import IsAdminOrSelf



@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def upgrade(request):
    serialized = ContactSerializer(data = request.DATA)
    if serialized.is_valid():
        data = {field: data for (field, data) in request.DATA.items()}
        email = data['email']
        password = data['password']

        user = authenticate(email = email, password = password)
        if user is not None:
            if user.is_active:
                if(request.user == user):
                    pass
                else:
                    return Response({'error':['Account does not match credentials']}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error':['The password is valid, but the account has been disabled']}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error':['The email and password were incorrect']}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'email': user.email}, status=status.HTTP_200_OK)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)