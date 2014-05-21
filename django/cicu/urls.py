from django.conf.urls import patterns, url, include


urlpatterns = patterns('cicu.views',
    url(r'^$', 'upload', name='upload-image'),
    url(r'^crop/$', 'crop', name='image-crop'),
    url(r'^crop-profile-picture/$', 'crop_profile_picture', name='image-crop'),
)
