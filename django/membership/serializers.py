from django import forms
from rest_framework import serializers



class ContactSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(widget=forms.PasswordInput())