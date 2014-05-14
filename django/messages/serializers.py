from rest_framework import serializers

from messages.models import Message

from django.utils.timezone import now


class InboxSerializer(serializers.ModelSerializer):
    sender = serializers.IntegerField(source='sender.email', required=True)  
    recipient = serializers.CharField(source='recipient.email', required=False)
    
    class Meta:
        model = Message
    
    


class DeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id',)
    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        obj = super(DeleteSerializer, self).restore_object(attrs, instance)

        obj.recipient_deleted_at = now()
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
    class Meta:
        model = Message
        #fields = ('id',)
    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        obj = super(ReplySerializer, self).restore_object(attrs, instance)

        print obj
        obj.save()
        return obj


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

        print obj
        obj.save()
        return obj