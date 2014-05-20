from django.conf.urls import patterns, include, url
from rest_framework import routers
from .views import UserViewSet, GroupViewSet, ProfessionalListView, LocationViewSet, ProfessionalObjView, PaymentView, ModifyMembershipView
from .views import ClientListView



router = routers.SimpleRouter(trailing_slash=False)

#router.register(r'/professionals', ProfessionalViewSet)
router.register(r'/groups', GroupViewSet)
router.register(r'/location', LocationViewSet)

# urlpatterns = router.urls

urlpatterns = patterns('',
	url(r'^/(?P<pk>[0-9]+)$', UserViewSet.as_view()),
	url(r'^/professionals/(?P<pk>[0-9]+)$', ProfessionalObjView.as_view()),
	url(r'^/professionals$', ProfessionalListView.as_view()),
	url(r'^/professionals/client-list$', ClientListView.as_view()),
	url(r'^', include(router.urls)),

	url(r'^/modify-payment-details/(?P<pk>[0-9]+)$', PaymentView.as_view()),
	
)