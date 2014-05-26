from django.conf.urls import patterns, include, url
from django.conf import settings
from rest_framework import routers
from feed.views import PictureEntryViewSet, VideoEntryViewSet, EventEntryViewSet, BlogEntryViewSet, EntryListView
from feed.views import CommentViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register('/picture', PictureEntryViewSet)
router.register('/video', VideoEntryViewSet)
router.register('/event', EventEntryViewSet)
router.register('/blog', BlogEntryViewSet)
router.register('/comment', CommentViewSet)

urlpatterns = patterns('',
	url(r'^', include(router.urls)),
	url(r'^$', EntryListView.as_view()),
	url(r'^/(?P<pk>[0-9]+)$', EntryListView.as_view()),
)
