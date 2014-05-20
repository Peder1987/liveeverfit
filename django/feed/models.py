from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
from django.utils.translation import ugettext_lazy as _

# FOR MORE INFORMATION REFER TO THIS
# https://django-model-utils.readthedocs.org/en/latest/managers.html

class Feed(models.Model):
    user = models.ForeignKey(User)

    
    # first_name = models.CharField(_('first name'), max_length=30, blank=True)
    # last_name = models.CharField(_('last name'), max_length=30, blank=True)
    # #custom fields
    # TIER_CHOICES = (
    #     (1, 'Tier 1'),
    #     (2, 'Tier 2'),
    #     (3, 'Tier 3'),
    #     (4, 'Tier 4'),
    #     (5, 'Tier 5'),
    #     (6, 'Grandfather Professional'),
    #     (7, 'Professional'),
    # )
    # tier = models.IntegerField(_('tier'), max_length=1, blank=True, choices=TIER_CHOICES, default=1, null=True)
    # GENDER_CHOICES = (
    #     ('M', 'Male'),
    #     ('F', 'Female'),
    # )
    # gender = models.CharField(_('gender'), max_length=1, blank=True, choices=GENDER_CHOICES)
    # location = models.CharField(_('location'), max_length=100, blank=True)
    # lat = models.CharField(_('latitude'), max_length=30, blank=True, default="29.760193")
    # lng = models.CharField(_('longitude'), max_length=30, blank=True, default="-95.369390")



class Entry(models.Model):
    """
	Entry class will be abstracted in order to 
	define the types of entries
	"""
    class Meta:
        abstract = True

class TextEntry(Entry):
    text = models.CharField(_('text'), max_length=300, blank=False)



class PhotoEntry(Entry):
    text = models.CharField(_('text'), max_length=300, blank=False)


