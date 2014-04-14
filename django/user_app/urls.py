from rest_framework import routers
from .views import UserViewSet, GroupViewSet

router = routers.SimpleRouter(trailing_slash=False)


router.register(r'', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = router.urls