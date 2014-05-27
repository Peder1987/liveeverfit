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

class AbstractEntrySerializer(serializers.ModelSerializer):
	type = serializers.Field(source="type")
	comments = CommentSerializer(source="comments", required=False)
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()

class TextEntrySerializer(AbstractEntrySerializer):
	
	class Meta:
		model = TextEntry

class PictureEntrySerializer(AbstractEntrySerializer):
	user = serializers.SlugRelatedField(slug_field="email")
	class Meta:
		model = PictureEntry

class CreatePictureEntrySerializer(serializers.ModelSerializer):
	class Meta:
		model = PictureEntry

class VideoEntrySerializer(AbstractEntrySerializer):
	class Meta:
		model = VideoEntry

class EventEntrySerializer(AbstractEntrySerializer):
	class Meta:
		model = EventEntry

class BlogEntrySerializer(AbstractEntrySerializer):
	class Meta:
		model = BlogEntry


class EntrySerializer(serializers.ModelSerializer):
	comments = CommentSerializer(source="comments")
	likes = serializers.Field(source="likes.count")
	user = FeedUserSerializer()
	
	def to_native(self, value):
		class_type = value.__class__.__name__

		if class_type == 'PictureEntry':
			obj = PictureEntrySerializer(instance=value).data
		elif class_type == 'VideoEntry':
			obj = VideoEntrySerializer(instance=value).data
		elif class_type == 'EventEntry':
			obj = EventEntrySerializer(instance=value).data
		elif class_type == 'BlogEntry':
			obj = BlogEntrySerializer(instance=value).data
		elif class_type == 'BlogEntry':
			obj = TextEntrySerializer(instance=value).data
		else:
			obj = TextEntrySerializer(instance=value).data
		return obj

	class Meta:
		model = Entry