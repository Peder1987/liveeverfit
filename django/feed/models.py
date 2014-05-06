from django.db import models

# Create your models here.
class Feed(models.Model):
    def __str__(self):
        return ugettext("%(object)s tagged with %(tag)s") % {
            "object": self.content_object,
            "tag": self.tag
        }




class Entry(models.Model):
	"""
	Entry class will be abstracted in order to 
	define the types of entries
	"""
    class Meta:
        abstract = True
