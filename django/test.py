
import os, sys, json, ast
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_server.settings")
from django.contrib.auth import get_user_model
User = get_user_model()
import datetime
from django.utils.timezone import utc, now
#from schedule.models import Calendar, Event
#Write code after this
##############################################

# text
# picture
# video
# event
# blog

# TextEntry
# PictureEntry
# VideoEntry
# EventEntry
# BlogEntry

from user_app.models import Professional
from feed.models import Entry, TextEntry, PictureEntry, VideoEntry, EventEntry, BlogEntry

text = TextEntry.objects.all()
picture = PictureEntry.objects.all()
video = VideoEntry.objects.all()
event = EventEntry.objects.all()
blog = BlogEntry.objects.all()

entry = Entry.objects.all().select_subclasses()
# print entry


for instance in entry:
	print instance
	filename= 'random'
	print instance.type
	now_time = now().strftime("%m_%d_%Y_%H_%M_%S_%f_")
	print os.path.join(
          "users","%d" % instance.user.id, instance.type, now_time+filename )
	
	
	
	
	
# print text
# print picture
# print video
# print event
# print blog