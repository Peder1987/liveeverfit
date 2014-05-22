#Django Libs
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.timezone import utc, now
from django.utils.timezone import utc
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.models import check_password
#Python Libs
import json
import string
import random
import datetime
#Models
from rest_framework.authtoken.models import Token
from user_app.models import Professional, Address, UniqueLocation
from django.contrib.auth import get_user_model
User = get_user_model()
#Rest Framework
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import parsers
from rest_framework import renderers
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers
#Serializers
from .serializers import EmailSerializer, CreateUserSerializer, ReturnUserSerializer, LogoutSerializer, PasswordSerializer, ForgotPasswordSerializer, ChangePasswordSerializer, ResetPasswordSerializer



def token_generator(size=5, chars=string.ascii_uppercase + string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    serialized = CreateUserSerializer(data=request.DATA)

    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.DATA.items()}
        del user_data['password2']
        
        user = User.objects.create_user(
            **user_data
        )

        response = ReturnUserSerializer(instance=user).data
        response['token'] = user.auth_token.key
        response['id'] = user.id
        user.shopify_create(user_data['password'])
        return Response(response, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def register_professional(request):
    serialized = CreateUserSerializer(data=request.DATA)
    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.DATA.items()}
        del user_data['password2']
        del user_data['profession']
        del user_data['education']
        del user_data['experience']
        del user_data['certification_name1']
        del user_data['certification_number1']
        del user_data['certification_name2']
        del user_data['certification_number2']
        del user_data['phone']
        del user_data['twitter']
        del user_data['facebook'] 
        del user_data['instagram'] 
        del user_data['youtube'] 
        del user_data['linkedin']
        del user_data['plus']
        del user_data['primary_address']

        user = User.objects.create_user(**user_data)
        pro = Professional.objects.create_prof(user)
        user_data = {field: data for (field, data) in request.DATA.items()}
        temp_address = user_data['primary_address']
        del user_data['password2']
        del user_data['primary_address']

        ##use a try to get through the bug of primary key

        city = temp_address['city']
        city = str(city)
        city = city.strip()
        state = temp_address['state']
        state = str(state)
        state = state.strip()
        temp_location = city + ', ' + state
        location = UniqueLocation.objects.get_or_create(location = temp_location)
        location[0].counter += 1
        location[0].save()

        pro.__dict__.update(**user_data)
        pro.location = temp_location
        pro.lat = temp_address['lat']
        pro.lng = temp_address['lng']
        pro.save()
        address = Address.objects.get(id = user.primary_address.id)
        address.__dict__.update(**temp_address)
        address.save()

        response = ReturnUserSerializer(instance=user).data
        response['token'] = user.auth_token.key
        response['id'] = user.id
        pro.shopify_create(user_data['password'])
        return Response(response, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'details':'Logged out'}, status=status.HTTP_200_OK)
    except:
        return Response({'details':'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)        


class AuthTokenSerializer(serializers.Serializer):
    """
    Restfuls AuthTokenSerializer with modifications to use email rather than user
    """
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Unable to login with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password"')


class ObtainAuthToken(APIView):
    """
    Restfuls ObtainAuthToken function
    """
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    model = Token

    def post(self, request):
        serializer = self.serializer_class(data=request.DATA)
        if serializer.is_valid():
            token, created = Token.objects.get_or_create(user=serializer.object['user'])
            return Response({'token': token.key, 'id': id})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
obtain_auth_token = ObtainAuthToken.as_view()


class ObtainExpiringAuthToken(ObtainAuthToken):
    def post(self, request):
        serializer = self.serializer_class(data=request.DATA)
        if serializer.is_valid():
            token, created =  Token.objects.get_or_create(user=serializer.object['user'])
            id = serializer.object['user'].id
            if not created:
                # update the created time of the token to keep it valid
                token.created = datetime.datetime.utcnow().replace(tzinfo=utc)
                token.save()

            return Response({'token': token.key, 'id': id})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

obtain_expiring_auth_token = ObtainExpiringAuthToken.as_view()


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def change_password(request):
    serialized = ChangePasswordSerializer(data = request.DATA)
    if serialized.is_valid():
        data = {field: data for (field, data) in request.DATA.items()}
        token = data['token']
        tokenObj = Token.objects.get(key = token)
        user = tokenObj.user

        if check_password(data['current_password'], user.password):
            user.set_password(data['password'])
            user.save()
            return Response({'details':['Success password changed']}, status=status.HTTP_200_OK)
        else:
            return Response({'current_password':['Wrong current password']}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def forgot_password(request):
    serialized = ForgotPasswordSerializer(data = request.DATA)
    if serialized.is_valid():
        data = {field: data for (field, data) in request.DATA.items()}
        email = data['email']
        user = User.objects.get(email = email)
        temp_password = token_generator(10)
        user.set_password(temp_password)
        user.save()

        if check_password(temp_password, user.password):
            subject = 'Password Reset'
            message = 'Change you password at http://0.0.0.0:9000/#/reset-password/' + temp_password + '/' + user.email
            send_mail(subject, message, 'admin@test.com', [email])
            return Response({'details':['Email sent']}, status=status.HTTP_200_OK)
        else:
            return Response({'email':['Email did not send']}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def reset_password(request):
    serialized = ResetPasswordSerializer(data = request.DATA)
    if serialized.is_valid():
        data = {field: data for (field, data) in request.DATA.items()}
        email = data['email']
        user = User.objects.get(email = email)

        if check_password(data['change_password_token'], user.password):
            user.set_password(data['password'])
            user.save()
            return Response({'details':['Success password changed']}, status=status.HTTP_200_OK)
        else:
            return Response({'change_password_token':['Invalid change password token']}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)
    



