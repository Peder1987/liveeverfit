from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
from django.utils.timezone import now
User = get_user_model()
import os
# FOR MORE INFORMATION REFER TO THIS
# https://django-model-utils.readthedocs.org/en/latest/managers.html
from model_utils.models import TimeStampedModel, TimeFramedModel
from model_utils.managers import InheritanceManager

def get_upload_path(instance, filename):
    now_time = now().strftime("%m_%d_%Y_%H_%M_%S_%f_")
    os.path.join(
          "users","%d" % instance.user.id, instance.type, now_time+filename )


class Entry(TimeStampedModel):
    """
	Entry class will be abstracted in order to 
	define the types of entries
	"""
    type = "entry"
    user = models.ForeignKey(User)
    text = models.CharField(_('text'), max_length=300, blank=False)
    likes = models.ManyToManyField(User, related_name='entries_liked', blank=True,null=True)
    objects = InheritanceManager()

class TextEntry(Entry):
    type = 'text'
    
class PhotoEntry(Entry):
    type = 'photo'
    img = models.ImageField(_('image'), upload_to=get_upload_path, blank=False)

class VideoEntry(Entry):
    type = 'video'
    url = models.FileField(_('Video'), upload_to=get_upload_path, blank=False, default=True)

class EventEntry(Entry, TimeFramedModel):
    type= 'event'
    allday = models.BooleanField(_('All day'), default=False)

class BlogEntry(Entry):
    type = 'blog'
    body = models.CharField(_('Body'), max_length=500, default='')
    


class Comment(TimeStampedModel):
    entry = models.ForeignKey(Entry, related_name='comments')
    user = models.ForeignKey(User)
    text = models.TextField('description', null=True, blank=True)
