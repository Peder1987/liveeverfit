
import os, sys, json, ast
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_server.settings")
from django.contrib.auth import get_user_model
User = get_user_model()
import datetime
from django.utils.timezone import utc, now
from schedule.models import Calendar, Event
#Write code after this
##############################################

print 'test'
print Calendar.objects.all()


for user in User.objects.all():
	obj, created = Calendar.objects.get_or_create(user=user)
	title = 'Account created'
	description = 'Account was created!'
	start = now()
	end = now() + datetime.timedelta(hours=1)
	data = {'creator' : user,
	        'title' : title,
	        'description' : description,
	        'start' : start,
	        'end' : end,
	        'calendar' : obj
	        }
	create_event = Event(**data)

	create_event.save()