# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from rest_framework import routers
from .views import AllNotificationViewSet


from django.conf.urls import *

router = routers.SimpleRouter(trailing_slash=False)
router.register(r'', AllNotificationViewSet)

urlpatterns = patterns('notifications.views',
    # url(r'^$', 'all', name='all'),
    # url(r'^unread/$', 'unread', name='unread'),
    # url(r'^mark-all-as-read/$', 'mark_all_as_read', name='mark_all_as_read'),
    # url(r'^mark-as-read/(?P<slug>\d+)/$', 'mark_as_read', name='mark_as_read'),
    # url(r'^mark-as-unread/(?P<slug>\d+)/$', 'mark_as_unread', name='mark_as_unread'),
    #url(r'^$', AllNotificationView.as_view()),
	
	url(r'^', include(router.urls)),
)


# urlpattern