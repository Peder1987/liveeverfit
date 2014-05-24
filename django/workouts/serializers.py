from django.contrib.auth.models import Group, Permission
from rest_framework import serializers
from workouts.models import Video, VideoComment
from django.db.models import F
from django.contrib.auth import get_user_model

User = get_user_model()
# for typeahead on workouts search
class TitleSerializer(serializers.ModelSerializer):
    def to_native(self, obj):
        return {"name": obj.title}

    class Meta:
        model = Video

    fields = ('title',)


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field="email", required=False)
    img = serializers.CharField(source='user.img.url', required=False)
    class Meta:
        model = VideoComment


class UserLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email',)


class VideoLikeSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(max_length=50)

    class Meta:
        model = Video
        fields = ('id', "user_email",)

    def to_native(self, obj):
        temp = super(VideoLikeSerializer, self).to_native(obj)
        user = User.objects.get(email=temp['user_email'])
        # best quick solution for M2M, django doesn't provide
        # a clean solution.
        if obj.likes_user.filter(pk=user.pk).exists():
            temp['user_likes'] = False
            obj.likes_user.remove(user)
        else:
            temp['user_likes'] = True
            obj.likes_user.add(user)

        return temp

    def validate_user_email(self, attrs, source):
        if User.objects.filter(email=attrs['user_email']).exists():
            pass
        else:
            raise serializers.ValidationError("User must exist to like content")

        return attrs


class VideoSerializer(serializers.ModelSerializer):
    img = serializers.ImageField(allow_empty_file=True, required=False)
    likes = serializers.Field(source="likes_user.count")

    class Meta:
        model = Video

    def to_native(self, obj):
        temp = super(VideoSerializer, self).to_native(obj)
        # In order to keep views on point, using F class to keep track
        obj.views = F('views') + 1
        obj.save()
        # check if user likes the video
        user = self.context['request'].user
        temp['user_likes'] = obj.likes_user.filter(pk=user.pk).exists()
        return temp


class VideoCommentSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True)

    class Meta:
        model = Video
        fields = ('comments',)

