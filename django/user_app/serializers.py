from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission

from rest_framework import serializers
from user_app.models import Professional
User = get_user_model()




class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id', required=True)  
    first_name = serializers.CharField(source='first_name', required=False)
    last_name = serializers.CharField(source='last_name', required=False)
    email = serializers.EmailField(source='email', required=False)
    #auth_token = serializers.CharField(read_only=True)
    last_login_on = serializers.DateTimeField(source='last_login',
                                              read_only=True)
    joined_on = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = ('id','url', 'email', 'first_name',
                  'last_name', 'is_staff', 'last_login_on',
                  'joined_on')


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


class ProfessionalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Professional