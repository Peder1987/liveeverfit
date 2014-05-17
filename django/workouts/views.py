from datetime import timedelta
from django.utils.timezone import utc, now
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action, link
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.filters import SearchFilter
from rest_framework import generics
from django.contrib.auth import get_user_model
User = get_user_model()
from workouts.models import Video, VideoComment
from workouts.filters import DifficultyFilterBackend, WorkoutTagFilterBackend
from workouts.serializers import TitleSerializer



class VideoViewSet(generics.ListAPIView):
    model = Video
    permission_classes = (IsAuthenticated,)
    paginate_by = 9
    filter_backends = (DifficultyFilterBackend, WorkoutTagFilterBackend, SearchFilter,)
    search_fields = ('title', )
    
class VideoObjectViewSet(generics.RetrieveAPIView):
    model = Video
    permission_classes = (IsAuthenticated,)
    

class TitleViewSet(generics.ListAPIView):
	paginate_by = None
	serializer_class = TitleSerializer
	model = Video
	permission_classes = (AllowAny,)
	search_fields = ('title', )