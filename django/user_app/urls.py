from django.conf.urls import patterns, include, url
from rest_framework import routers
from .views import UserViewSet, GroupViewSet, ProfessionalListView, LocationViewSet, ProfessionalObjView, PaymentView, ModifyMembershipView
from .views import ClientListView, CreditcardView



router = routers.SimpleRouter(trailing_slash=False)

#router.register(r'/professionals', ProfessionalViewSet)
router.register(r'/groups', GroupViewSet)
router.register(r'/location', LocationViewSet)

# urlpatterns = router.urls

urlpatterns = patterns('',
	# main view
	url(r'^/(?P<pk>[0-9]+)$', UserViewSet.as_view()),
	# view to modify payment details
	url(r'^/modify-payment-details/(?P<pk>[0-9]+)$', PaymentView.as_view()),
	url(r'^/modify-membership/(?P<pk>[0-9]+)$', ModifyMembershipView.as_view()),
	# view to retrieve creditcards
	url(r'^/creditcards/(?P<pk>[0-9]+)$', CreditcardView.as_view()),
	url(r'^/professionals$', ProfessionalListView.as_view()),
	url(r'^/professionals/(?P<pk>[0-9]+)$', ProfessionalObjView.as_view()),
	url(r'^/professionals/client-list$', ClientListView.as_view()),
	url(r'^', include(router.urls)),
	
)