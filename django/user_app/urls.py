from django.conf.urls import patterns, include, url
from rest_framework import routers
from .views import UserViewSet, GroupViewSet, ProfessionalViewSet

router = routers.SimpleRouter(trailing_slash=False)

router.register(r'/professionals', ProfessionalViewSet)
router.register(r'/groups', GroupViewSet)

# urlpatterns = router.urls

urlpatterns = patterns('',
	url(r'^/(?P<pk>[0-9]+)$', UserViewSet.as_view()),
	url(r'^', include(router.urls)),
)