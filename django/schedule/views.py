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
from schedule.models import Calendar, Event
from schedule.permissions import IsAdminOrSelf
from schedule.serializers import CalendarSerializer, EventSerializer
from schedule.filters import EventFilter, IsCalendarOwnerFilterBackend
from schedule.filters import DatetimeFilterBackend, NowFilterBackend


class EventViewSet(generics.ListCreateAPIView):
    model = Event
    filter_backends = (DatetimeFilterBackend, NowFilterBackend, filters.OrderingFilter)
    filter_class = EventFilter
    ordering = ('start',)
    serializer_class = EventSerializer
    permission_classes = (IsAdminOrSelf,)
    filter_fields = ('start__month', )
    def get_queryset(self):
        pk = self.kwargs.get('pk', None)
        if pk:
            return Event.objects.filter(user=pk)
        else:
            return Event.objects.filter(user=self.request.user)
            

class EventObjectViewSet(generics.RetrieveUpdateDestroyAPIView):
    model = Event
    filter_class = EventFilter
    ordering = ('start',)
    serializer_class = EventSerializer
    permission_classes = (IsAdminOrSelf,)
    
