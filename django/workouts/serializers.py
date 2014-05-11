from django.contrib.auth.models import Group, Permission
from rest_framework import serializers
from workouts.models import Video



class TitleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Video
        fields = ('title',)

