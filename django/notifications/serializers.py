from django import forms
from django.contrib.auth.models import Group, Permission
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import serializers
from .models import Notification



class AllNotificationSerializer(serializers.ModelSerializer):
	message = serializers.Field(source="message")
	class Meta:
		model = Notification
		fields = (	"id", "level", "unread", "timestamp", "public", "message", "target_object_id")

	