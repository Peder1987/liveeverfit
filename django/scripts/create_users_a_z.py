
import os, sys, json, ast
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_server.settings")
from django.contrib.auth import get_user_model
User = get_user_model()
import datetime
from django.utils.timezone import utc, now
import string
#from schedule.models import Calendar, Event
#Write code after this
##############################################

from user_app.models import Professional

def create_professional_dummy_data():
	accepting = True
	tags = ["looksy", 'crossfit', 'fitness']
	counter = 0
	for letter in string.ascii_uppercase:
		email = 'pro_' + letter + '@test.com'
		password = 'admin123'
		first = 'pro_first_' + letter 
		last = 'pro_last_' + letter

		if not Professional.objects.filter(email=email).exists():
			data_dict = {"email":email, "password" : password, "first_name":first, "last_name":last,
				"password":password,
			}
			user = User.objects.create_user(**data_dict)
			pro = Professional.objects.create_prof(user)
			pro.is_accepting=accepting
			pro.tags.add(tags[counter%3])
			pro.save()
		accepting = not accepting
		counter += 1

		

def create_user_dummy_data():
	for letter in string.ascii_uppercase:
		email = 'user_' + letter + '@test.com'
		password = 'admin123'

		first = 'user_first_' + letter 
		last = 'user_last_' + letter
		if not User.objects.filter(email=email).exists():
			data_dict = {"email":email, "password" : password, "first_name":first, "last_name":last,
				"password":password,
			}
			user = User.objects.create_user(**data_dict)



