
import os, sys, json, ast
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_server.settings")
from django.contrib.auth import get_user_model
User = get_user_model()
import datetime
from django.utils.timezone import utc, now
#from schedule.models import Calendar, Event
#Write code after this
##############################################

from user_app.models import Professional


users = User.objects.all()
pros = Professional.objects.all()

user =  User.objects.get(email='admin@test.com')
pro = User.objects.get(email='pro2@test.com')

# print Professional.objects.filter(pk=user.id).exists()
# print Professional.objects.filter(pk=pro.id).exists()
import string


create_professional_dummy_data()
create_user_dummy_data()