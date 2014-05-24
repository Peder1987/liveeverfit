from django.conf.urls import patterns, include, url
from django.conf import settings
from rest_framework import routers
from feed.views import TextEntryViewSet, PictureEntryViewSet, VideoEntryViewSet, EventEntryViewSet, BlogEntryViewSet, EntryListView

router = routers.SimpleRouter(trailing_slash=False)
#router.register('', EntryViewSet)
router.register('text', TextEntryViewSet)
router.register('picture', PictureEntryViewSet)
router.register('video', VideoEntryViewSet)
router.register('event', EventEntryViewSet)
router.register('blog', BlogEntryViewSet)

urlpatterns = patterns('',
	url(r'^', include(router.urls)),
	url(r'^$', EntryListView.as_view()),
	url(r'^(?P<pk>[0-9]+)$', EntryListView.as_view()),
)
