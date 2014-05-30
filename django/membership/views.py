#Django Libs
from django.core.mail import send_mail
from django.contrib.auth import authenticate
#Rest Framework
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers
#Stripe Calls
from stripe_payments.views  import*
#Serializers
from .serializers import AuthSerializer, UserSerializer
#Permissions
from .permissions import IsAdminOrSelf
#Models
from user_app.models import Professional, Address, Certification
from django.contrib.auth import get_user_model
User = get_user_model()



@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def upgrade(request):
    serialized = AuthSerializer(data = request.DATA)
    if serialized.is_valid():
        data = {field: data for (field, data) in request.DATA.items()}
        email = data.get('email')
        password = data.get('password')

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


@api_view(['POST'])
@permission_classes((AllowAny,))
def user_tier(request):
    serialized = UserSerializer(data=request.DATA)
    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.DATA.items()}
        user_id = user_data.get('id')
        user_data.pop('id', None)

        if User.objects.filter(id = user_id).exists():
            user = User.objects.get(id = user_id)
        else:
            return Response({'error': ['User does not exists']}, status=status.HTTP_400_BAD_REQUEST)

        if user.tier == 6 or user.tier == 7:
            return Response({'error': ['Already a profesional']}, status=status.HTTP_400_BAD_REQUEST)
        
        user.__dict__.update(
            **user_data
        )
        user.save()

        return Response({'details': 'success'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def upgrade_to_professional(request):
    serialized = UserSerializer(data=request.DATA)
    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.DATA.items()}
        user_id = user_data.get('id')
        temp_address = user_data.get('primary_address')
        user_data.pop('primary_address', None)
        certification_name1 = user_data.pop('certification_name1', None)
        certification_number1 = user_data.pop('certification_number1', None)
        certification_name2 = user_data.pop('certification_name2', None)
        certification_number2 = user_data.pop('certification_number2', None)

        if User.objects.filter(id = user_id).exists:
            user = User.objects.get(id = user_id)
        else:
            return Response({'error':['Can not upgrade']}, status=status.HTTP_400_BAD_REQUEST)

        if user.tier == 6 or user.tier == 7:
            return Response({'error': ['Already a profesional']}, status=status.HTTP_400_BAD_REQUEST)

        pro = Professional.objects.create_prof(user)

        try:
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
        except:
            pass

        pro.__dict__.update(**user_data)
        try:
            pro.location = temp_location
            pro.lat = temp_address['lat']
            pro.lng = temp_address['lng']
        except:
            pass
        if certification_name1:
            certification1 = Certification(user = pro, certification_name = certification_name1, certification_number = certification_number1)
            certification1.save()
        if certification_name2:
            certification2 = Certification(user = pro, certification_name = certification_name2, certification_number = certification_number2)
            certification2.save()
        pro.save()
        address = Address.objects.get(id = user.primary_address.id)
        address.__dict__.update(**temp_address)
        address.save()

        return Response({'details': 'success'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def cancel(request):
    serialized = UserSerializer(data=request.DATA)
    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.DATA.items()}
        user_id = user_data.get('id')
    
        if User.objects.filter(id = user_id).exists():
            user = User.objects.get(id = user_id)
            user.tier = 1
            user.save()
            user.stripe_cancel_subscription()

        return Response({'details': 'success'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)