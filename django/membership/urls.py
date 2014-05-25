#Django Libs
from django.conf.urls import patterns, include, url



urlpatterns = patterns('',

	url(r'^auth', 'membership.views.upgrade'),	
	
)
