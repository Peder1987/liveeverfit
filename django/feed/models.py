from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
from django.utils.timezone import now
User = get_user_model()

# FOR MORE INFORMATION REFER TO THIS
# https://django-model-utils.readthedocs.org/en/latest/managers.html
from model_utils.models import TimeStampedModel, TimeFramedModel
from model_utils.managers import InheritanceManager

# class Feed(TimeStampedModel):
    
#     entries = models.ForeignKey(Entry)
    

def get_upload_path(instance, filename):
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
    pass

class PictureEntry(Entry):
    type = 'picture'
    img = models.ImageField(_('image'), upload_to=get_upload_path, blank=False)

class VideoEntry(Entry):
    type = 'video'
    video = models.ImageField(_('image'), upload_to=get_upload_path, blank=False)

class EventEntry(Entry, TimeFramedModel):
    type= 'event'
    pass

class BlogEntry(Entry):
    type = 'blog'
    pass


class Comment(TimeStampedModel):
    entry = models.ForeignKey(Entry)
    user = models.ForeignKey(User)
    comment = models.TextField('description', null=True, blank=True)
