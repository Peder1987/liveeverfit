c
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
