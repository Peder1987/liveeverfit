from django.conf.urls import patterns, include, url
from django.conf import settings
from rest_framework import routers

from workouts.views import VideoViewSet, VideoObjectViewSet, TitleViewSet



router = routers.SimpleRouter(trailing_slash=False)
# router.register('', CalendarViewSet)



urlpatterns = patterns('',
    url(r'^video/?$', VideoViewSet.as_view()),
    url(r'^video/(?P<pk>[0-9]+)$', VideoObjectViewSet.as_view()),
    url(r'^titles?$', TitleViewSet.as_view()),
)
