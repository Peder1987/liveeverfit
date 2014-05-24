#Django Libs
from django.conf.urls import patterns, include, url



urlpatterns = patterns('',

	url(r'^upgrade', 'membership.views.upgrade'),	
	
)
