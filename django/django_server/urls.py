from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()



urlpatterns = patterns('',

    #Admin 
    url(r'^admin/', include(admin.site.urls)),

    #My Apps
    url(r'^users', include('user_app.urls')),
    url(r'^accounts/', include('user_auth.urls')),

    #Imported Apps
    url(r'^docs/', include('rest_framework_swagger.urls')),
)


if settings.DEBUG:
    urlpatterns = patterns('',
    
    #static
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.STATIC_ROOT}),

    #media
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT}),


) + urlpatterns