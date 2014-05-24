import ast, json
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from feed.models import Entry, TextEntry, PictureEntry, VideoEntry, EventEntry, BlogEntry



class TextEntrySerializer(serializers.ModelSerializer):
	class Meta:
		model = TextEntry

class PictureEntrySerializer(serializers.ModelSerializer):
	class Meta:
		model = PictureEntry

class VideoEntrySerializer(serializers.ModelSerializer):
	class Meta:
		model = VideoEntry

class EventEntrySerializer(serializers.ModelSerializer):
	class Meta:
		model = EventEntry

class BlogEntrySerializer(serializers.ModelSerializer):
	class Meta:
		model = BlogEntry


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