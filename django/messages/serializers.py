from rest_framework import serializers
from django.utils.timezone import now
from messages.models import Message

from user_app.models import Professional
from django.contrib.auth import get_user_model
User = get_user_model()


class InboxSerializer(serializers.ModelSerializer):
    # sender = serializers.IntegerField(source='sender.email', required=True)  
    # recipient = serializers.IntegerField(source='recipient.email', required=True)  
    # img = serializers.IntegerField(source='sender.img.url', required=True)
    #recipient = serializers.CharField(source='recipient.email', required=False)
    
    class Meta:
        model = Message
class SentSerializer(InboxSerializer):
    pass
class TrashSerializer(InboxSerializer):
    pass

class DeleteSerializer(serializers.ModelSerializer):
    # sender = serializers.SlugRelatedField(slug_field="email", required=False)  
    # recipient = serializers.SlugRelatedField(slug_field="email", required=False)  
    # view = serializers.CharField(required=True)  
    class Meta:
        model = Message
        fields = ('id',)
        exclude = ('img', 'body', 'subject')

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        obj = super(DeleteSerializer, self).restore_object(attrs, instance)
        
        if 'inbox' in attrs['view']:
            obj.recipient_deleted_at = now()
            obj.save()
        if 'sent' in attrs['view']:
            obj.sender_deleted_at = now()
            obj.save()

        return obj


class UnDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id',)


    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        obj = super(UnDeleteSerializer, self).restore_object(attrs, instance)

        obj.recipient_deleted_at = None
        obj.save()
        return obj

        
class ComposeSerializer(serializers.ModelSerializer):
    # recipient = serializers.SlugRelatedField(slug_field="email")

    class Meta:
        model = Message
        fields = ('recipient', 'subject', 'body', 'sender')

    def __init__(self, *args, **kwargs):
        
        # Logged in user to be sender
        try:
            user = kwargs['context']['request'].user
            kwargs['data']['sender'] = user.pk
        except:
            pass
        return super(ComposeSerializer, self).__init__(*args, **kwargs)

    def validate_recipient(self, attrs, source):
        print attrs
        
        return attrs

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        #fields = ('id',)

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        obj = super(ReplySerializer, self).restore_object(attrs, instance)
        return obj


class ProfessionalConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professional
        fields = ('id', 'first_name', 'last_name', 'img',)

class ConnectionSerializer(serializers.ModelSerializer):
    connection = ProfessionalConnectionSerializer()
    class Meta:
        model = User
        fields = ('id', 'connection')
        read_only = ('connection')

    def to_native(self, value):
        obj = super(ConnectionSerializer, self).to_native(value)
        user_id = value.id
        user_tier = value.tier
        if user_tier == 7 or user_tier == 6:
            obj['user_type'] = 'professional'
        elif user_tier <= 5 and user_tier >= 2:
            obj['user_type'] = 'upgraded'
        else:
            obj['user_type'] = 'user'

        return obj