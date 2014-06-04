import ast, json
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from feed.models import Entry, TextEntry, PhotoEntry, VideoEntry, BlogEntry, Comment, Flagged, SharedEntry
from django.contrib.auth import get_user_model
User = get_user_model()
from schedule.models.events import Event
from schedule.models.calendars import Calendar



class FeedUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ("first_name", "last_name", "id", "img")
		read_only_fields = ('first_name', 'last_name', 'img')

class CommentSerializer(serializers.ModelSerializer):
    img = serializers.CharField(source='user.img.url', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    class Meta:
        model = Comment

class AbstractEntrySerializer(serializers.ModelSerializer):
	type = serializers.Field(source="type")
	comments = CommentSerializer(source="comments", required=False)
	likes = serializers.Field(source="likes.count")
	#nesting causes problems in creation of a entry, explicit calls made cleaner code
	profile_img = serializers.CharField(source='user.img.url', required=False)
	first_name = serializers.CharField(source='user.first_name', required=False)
	last_name = serializers.CharField(source='user.last_name', required=False)


class TextEntrySerializer(AbstractEntrySerializer):
	
	class Meta:
		model = TextEntry

class PhotoEntrySerializer(AbstractEntrySerializer):
	
	class Meta:
		model = PhotoEntry	

class VideoEntrySerializer(AbstractEntrySerializer):
	class Meta:
		model = VideoEntry

class EventEntrySerializer(AbstractEntrySerializer):
	end = serializers.DateTimeField(required=False, format=None, input_formats=None)
	start = serializers.DateTimeField(format=None, input_formats=None)
 
	class Meta:
		model = Event
		fields = ('id', 'start', 'end', 'title', 'description', 'creator', 'calendar', 'created_on', 'allDay', 'user')

	def validate_end(self, attrs, source):
		end = attrs.get('end')
		if end is None:
			attrs['end'] = attrs.get('start')
			return attrs
		else:
			return attrs

	def validate_calendar(self, attrs, source):
		creator = attrs.get('creator')
		attrs['calendar'] = Calendar.objects.get(user = creator)
		return attrs

	def validate_title(self, attrs, source):
		title = attrs.get('title')
		attrs['text'] = title
		return attrs


class BlogEntrySerializer(AbstractEntrySerializer):
	class Meta:
		model = BlogEntry

class FlaggedSerializer(serializers.ModelSerializer):
	class Meta:
		model = Flagged

class EntrySerializer(serializers.ModelSerializer):
	comments = CommentSerializer(source="comments")
	likes = serializers.Field(source="likes.count")
	#user = FeedUserSerializer()
	
	def to_native(self, value):
		class_type = value.__class__.__name__
		if class_type == 'PhotoEntry':
			obj = PhotoEntrySerializer(instance=value).data
		elif class_type == 'VideoEntry':
			obj = VideoEntrySerializer(instance=value).data
		elif class_type == 'Event':
			obj = EventEntrySerializer(instance=value).data
		elif class_type == 'BlogEntry':
			obj = BlogEntrySerializer(instance=value).data
		elif class_type == 'BlogEntry':
			obj = TextEntrySerializer(instance=value).data
		elif class_type == 'SharedEntry':
			obj = SharedEntrySerializer(instance=value).data
		else:
			obj = TextEntrySerializer(instance=value).data


		if 'request' in self.context:
			user = self.context['request'].user
			if value.likes.filter(pk=user.pk).exists():
				obj['user_likes'] = True
			else:
				obj['user_likes'] = False

		
		obj['shares'] = SharedEntry.objects.filter(entry=value).count()
		
		return obj

	class Meta:
		model = Entry


class SharedEntrySerializer(AbstractEntrySerializer):
	shared_entry = EntrySerializer(source="entry", required=False)

	def to_native(self, value):
		class_type = value.__class__.__name__
		# since SharedEntry referes to "Entry" then 
		# we have to grab super class (if exists) and
		# for serialization give it it's proper type so 
		# EntrySerializer can work properly
		entry_subclass = Entry.objects.get_subclass(id=value.entry.id)
		value.entry = entry_subclass
		obj =super(SharedEntrySerializer, self).to_native(value)
		return obj

	class Meta:
		model = SharedEntry

class EntryLikeSerializer(serializers.ModelSerializer):
	user_id = serializers.CharField(max_length=50)
	class Meta:
		model = Entry
		fields = ('id', "user_id")
	def to_native(self, obj):
		temp = super(EntryLikeSerializer, self).to_native(obj)
		user_id = temp.get('user_id')
		user = User.objects.get(pk=user_id)
		if obj.likes.filter(pk=user.pk).exists():
			temp['user_likes'] = False
			obj.likes.remove(user)
		else:
			temp['user_likes'] = True
			obj.likes.add(user)
		return temp	

class ListEntrySerializer(serializers.ModelSerializer):	
	def to_native(self, value):
		class_type = value.__class__.__name__

		if class_type == 'PhotoEntry':
			obj = PhotoEntrySerializer(instance=value).data
		elif class_type == 'VideoEntry':
			obj = VideoEntrySerializer(instance=value).data
		elif class_type == 'Event':
			obj = EventEntrySerializer(instance=value).data
		elif class_type == 'BlogEntry':
			obj = BlogEntrySerializer(instance=value).data
		elif class_type == 'SharedEntry':
			obj = SharedEntrySerializer(instance=value).data
		else:
			obj = TextEntrySerializer(instance=value).data
		return obj

	class Meta:
		model = Entry


class RelationshipTypeAheadSerializer(serializers.ModelSerializer):
    # def to_native(self, value):
    #     print value
    #     return {"name": 'value.title'}

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name',)