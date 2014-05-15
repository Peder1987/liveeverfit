
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
	for letter in string.ascii_uppercase:
		email = 'pro_' + letter + '@test.com'
		password = 'admin123'

		if not Professional.objects.filter(email=email).exists():
			user = User.objects.create_user(email, password)
			pro = Professional.objects.create_prof(user)


def create_user_dummy_data():
	for letter in string.ascii_uppercase:
		email = 'user_' + letter + '@test.com'
		password = 'admin123'

		if not User.objects.filter(email=email).exists():
			user = User.objects.create_user(email, password)



