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
# from feed.models import Calendar, Event
from feed.permissions import IsOwnerOrReadOnly
# from feed.serializers import CalendarSerializer, EventSerializer
# from feed.filters import EventFilter, IsCalendarOwnerFilterBackend
# from feed.filters import DatetimeFilterBackend, NowFilterBackend
from feed.serializers import EntrySerializer, TextEntrySerializer, PictureEntrySerializer, VideoEntrySerializer, EventEntrySerializer, BlogEntrySerializer, CommentSerializer
from feed.models import TextEntry, PictureEntry, VideoEntry, EventEntry, BlogEntry, Entry, Comment


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

class PictureEntryViewSet(viewsets.ModelViewSet):
	model = PictureEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = PictureEntrySerializer

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
	model = BlogEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = BlogEntrySerializer