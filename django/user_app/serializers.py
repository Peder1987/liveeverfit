from django import forms
from django.contrib.auth.models import Group, Permission
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework import serializers
from user_app.models import Professional, UniqueLocation




class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id', required=True)  
    first_name = serializers.CharField(source='first_name', required=False)
    last_name = serializers.CharField(source='last_name', required=False)
    email = serializers.EmailField(source='email', required=False)
    last_login_on = serializers.DateTimeField(source='last_login',read_only=True)
    joined_on = serializers.DateTimeField(source='date_joined', read_only=True)
    img = serializers.ImageField(allow_empty_file=True, required=False)

    class Meta:
        model = User
        exclude = ('password', 'is_superuser', 'connection', 'groups', 'user_permissions',)

    def to_native(self, value):
        obj = super(UserSerializer, self).to_native(value)
        if Professional.objects.filter(pk=obj['id']).exists():
            pro = Professional.objects.get(pk=obj['id'])
            obj = ProfessionalSerializer(instance=pro).data
            obj['shopify_sales'] = pro.shopify_sales()
            obj['type'] = 'professional'
            print obj
        elif obj['is_upgraded']:
            obj['type'] = 'upgraded'
        else:
            obj['type'] = 'user'
        return obj

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueLocation
        fields = ('location',)



class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        widget=forms.PasswordInput(),
        required=False
    )


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    permissions = serializers.SlugRelatedField(many=True,
                                               slug_field='codename',
                                               queryset=Permission.objects.all())

    class Meta:
        model = Group
        fields = ('url', 'name', 'permissions')


class ProfessionalListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    class Meta:
        model = Professional
        fields = ("first_name", "last_name", "profession", "gender", "location", "is_accepting", "img", 'lat', 'lng',)



class ProfessionalSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    class Meta:
        model = Professional
        exclude = ('password', 'is_superuser', 'connection', 'groups', 'user_permissions', "customer_list")


class ClientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name',)


class ModifyMembershipSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    
    class Meta:
        model = User
        
class CreditcardSerializer(serializers.ModelSerializer):
    creditcard = serializers.Field(source='stripe_get_creditcard')

    class Meta:
        model = User
        fields = ('id', 'creditcard',)

class PaymentSerializer(serializers.ModelSerializer):
    #email = serializers.EmailField(source='email', required=False)
    stripeToken = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id','stripeToken',)

    def to_native(self, value):
        # no need to return anything
        obj = super(PaymentSerializer,self).to_native(value)
        stripe_token = obj['stripeToken']
        value.stripe_edit_creditcard(stripe_token)

    
