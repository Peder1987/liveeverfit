from django.contrib.auth.models import Group, Permission
from rest_framework import serializers
from workouts.models import Video, VideoComment
from django.db.models import F


class TitleSerializer(serializers.ModelSerializer):

	def to_native(self, obj):
		return {"name":obj.title}
	class Meta:
		model = Video
        fields = ('title',)

class VideoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Video
	def to_native(self, obj):
		temp = super(VideoSerializer,self).to_native(obj)
		# In order to keep views on point, using F class to keep track
		obj.views = F('views') + 1
		obj.save()
		return temp

        
class CommentSerializer(serializers.ModelSerializer):
	user = serializers.SlugRelatedField(slug_field="email", required=False)  
	class Meta:
		model = VideoComment


class VideoCommentSerializer(serializers.ModelSerializer):
	comments = CommentSerializer(many=True)
	class Meta:
		model = Video
		fields = ('comments',)

