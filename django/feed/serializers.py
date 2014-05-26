import ast, json
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from feed.models import Entry, TextEntry, PictureEntry, VideoEntry, EventEntry, BlogEntry, Comment
from django.contrib.auth import get_user_model
User = get_user_model()

class FeedUserSerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	class Meta:
		model = User
		fields = ("first_name", "last_name", "id", "img")

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field="email", required=False)
    img = serializers.CharField(source='user.img.url', required=False)
    class Meta:
        model = Comment

class TextEntrySerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()
	class Meta:
		model = TextEntry

class PictureEntrySerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()
	class Meta:
		model = PictureEntry

class VideoEntrySerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()
	class Meta:
		model = VideoEntry

class EventEntrySerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()
	class Meta:
		model = EventEntry

class BlogEntrySerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()
	class Meta:
		model = BlogEntry

class CommentSerializer(serializers.ModelSerializer):
	likes = serializers.Field(source="likes.count")
	class Meta:
		model = Comment

class EntrySerializer(serializers.ModelSerializer):
	
	def to_native(self, value):
		class_type = value.__class__.__name__
		if class_type == 'TextEntry':
			obj = TextEntrySerializer(instance=value).data
			obj['type'] = 'text'
		elif class_type == 'PictureEntry':
			obj = PictureEntrySerializer(instance=value).data
			obj['type'] = 'picture'
		elif class_type == 'VideoEntry':
			obj = VideoEntrySerializer(instance=value).data
			obj['type'] = 'video'
		elif class_type == 'EventEntry':
			obj = EventEntrySerializer(instance=value).data
			obj['type'] = 'event'
		elif class_type == 'BlogEntry':
			obj = BlogEntrySerializer(instance=value).data
			obj['type'] = 'blog'
		else:
			obj = super(EntrySerializer, self).to_native(value)
			obj['type'] = 'entry'
		return obj

	class Meta:
		model = Entry