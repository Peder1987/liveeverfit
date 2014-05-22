from django.contrib.auth.models import Group, Permission
from rest_framework import serializers
from workouts.models import Video, VideoComment



class TitleSerializer(serializers.ModelSerializer):

	def to_native(self, obj):
		return {"name":obj.title}
	class Meta:
		model = Video
        fields = ('title',)

class CommentSerializer(serializers.ModelSerializer):
	user = serializers.SlugRelatedField(slug_field="email", required=False)  
	class Meta:
		model = VideoComment

class VideoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Video

class VideoCommentSerializer(serializers.ModelSerializer):
	comments = CommentSerializer(many=True)
	class Meta:
		model = Video
		fields = ('comments',)

