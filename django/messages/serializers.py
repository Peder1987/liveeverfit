from rest_framework import serializers

from messages.models import Message

from django.utils.timezone import now


class InboxSerializer(serializers.ModelSerializer):
    sender = serializers.IntegerField(source='sender.email', required=True)  
    recipient = serializers.IntegerField(source='recipient.email', required=True)  
    img = serializers.IntegerField(source='sender.img.url', required=True)
    #recipient = serializers.CharField(source='recipient.email', required=False)
    
    class Meta:
        model = Message
    
    
class SentSerializer(serializers.ModelSerializer):
    sender = serializers.IntegerField(source='sender.email', required=True)
    recipient = serializers.IntegerField(source='recipient.email', required=True)
    img = serializers.IntegerField(source='recipient.img.url', required=True)
    #recipient = serializers.CharField(source='recipient.email', required=False)

    class Meta:
        model = Message

        
class TrashSerializer(InboxSerializer):
    pass

class DeleteSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(slug_field="email", required=False)  
    recipient = serializers.SlugRelatedField(slug_field="email", required=False)  
    view = serializers.CharField(required=True)  
    class Meta:
        model = Message
        fields = ('id', 'recipient', 'sender', 'view')
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
    recipient = serializers.SlugRelatedField(slug_field="email")

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