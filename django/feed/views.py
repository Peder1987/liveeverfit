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
# from feed.permissions import IsAdminOrSelf
# from feed.serializers import CalendarSerializer, EventSerializer
# from feed.filters import EventFilter, IsCalendarOwnerFilterBackend
# from feed.filters import DatetimeFilterBackend, NowFilterBackend


