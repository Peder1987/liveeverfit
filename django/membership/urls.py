#Django Libs
from django.conf.urls import patterns, include, url



urlpatterns = patterns('',

	url(r'^upgrade-tier', 'membership.views.upgrade'),	
	
)
