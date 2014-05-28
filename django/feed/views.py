from datetime import timedelta
from django.utils.timezone import utc, now
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action, link
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import generics
from django.contrib.auth import get_user_model
User = get_user_model()
from feed.permissions import IsOwnerOrReadOnly
from feed.serializers import EntrySerializer, TextEntrySerializer, PhotoEntrySerializer, VideoEntrySerializer, EventEntrySerializer
from feed.serializers import BlogEntrySerializer, CommentSerializer, FlaggedSerializer
from feed.models import PhotoEntry, VideoEntry, EventEntry, BlogEntry, Entry, Comment, TextEntry, Flagged


class EntryListView(generics.ListAPIView):
	serializer_class = EntrySerializer	
	permission_classes = (IsOwnerOrReadOnly,)
	filter_backends = (filters.OrderingFilter,)
	ordering = ('-created',)
	def get_queryset(self):
		pk = self.kwargs.get('pk', None)
		if pk:
			return Entry.objects.filter(user=pk).select_subclasses()
		else:
			return Entry.objects.all().select_subclasses()

class TextEntryViewSet(viewsets.ModelViewSet):
	model = TextEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = TextEntrySerializer

class PhotoEntryViewSet(viewsets.ModelViewSet):
	model = PhotoEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = PhotoEntrySerializer
	def get_serializer_class(self):
		
		return PhotoEntrySerializer


class VideoEntryViewSet(viewsets.ModelViewSet):
	model = VideoEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = VideoEntrySerializer
	

class EventEntryViewSet(viewsets.ModelViewSet):
	model = EventEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = EventEntrySerializer

class BlogEntryViewSet(viewsets.ModelViewSet):
	model = BlogEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = BlogEntrySerializer


class CommentViewSet(viewsets.ModelViewSet):
	model = Comment
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = CommentSerializer


class FlaggedCreateView(generics.CreateAPIView):
	model = Flagged
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = FlaggedSerializer
