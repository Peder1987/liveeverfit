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
from .serializers import AuthSerializer, UserSerializer
#Permissions
from .permissions import IsAdminOrSelf
#Models
from user_app.models import Professional, Address
from django.contrib.auth import get_user_model
User = get_user_model()



@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def upgrade(request):
    serialized = AuthSerializer(data = request.DATA)
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



@api_view(['POST'])
@permission_classes((AllowAny,))
def upgrade_to_professional(request):
    print 'Works'
    serialized = UserSerializer(data=request.DATA)
    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.DATA.items()}
        print user_data
        user_id = user_data['id']
        print user_id

        if User.objects.filter(id = user_id).exists:
            user = User.objects.get(id = user_id)
            print user
        else:
            return Response({'error':['Can not upgrade']}, status=status.HTTP_400_BAD_REQUEST)

        pro = Professional.objects.create_prof(user)
        print pro

        user_data = {field: data for (field, data) in request.DATA.items()}
        temp_address = user_data['primary_address']
        del user_data['primary_address']

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

        print 'here yea'
        pro.__dict__.update(**user_data)
        try:
            pro.location = temp_location
            pro.lat = temp_address['lat']
            pro.lng = temp_address['lng']
        except:
            pass
        pro.save()
        address = Address.objects.get(id = user.primary_address.id)
        address.__dict__.update(**temp_address)
        address.save()
        print 'maaa'

        
        print user.password
        pro.shopify_create(user.password)
        return Response({'details': 'success'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)