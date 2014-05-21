from django.conf.urls import patterns, include, url
from django.conf import settings
from rest_framework import routers
from schedule.models import Calendar
from schedule.views import EventViewSet,EventObjectViewSet, EventViewSet



# router = routers.SimpleRouter(trailing_slash=False)
# router.register('', CalendarViewSet)
# router.register('event', EventViewSet)


urlpatterns = patterns('',
    # url(r'^(?P<pk>[0-9]+)$', EventViewSet.as_view()),
    # url(r'^event/?$', EventViewSet.as_view()),
    # url(r'^event/(?P<pk>[0-9]+)$', EventObjectViewSet.as_view()),
)
