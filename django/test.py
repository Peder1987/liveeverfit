
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
from workouts.models import Video

users = User.objects.all()
pros = Professional.objects.all()

user =  User.objects.get(email='admin@test.com')
pro = User.objects.get(email='pro2@test.com')

# print Professional.objects.filter(pk=user.id).exists()
# print Professional.objects.filter(pk=pro.id).exists()
import string
def create_workout_videos():
	accepting = True
	tags = ["looksy", 'crossfit', 'fitness']
	profession_list = ['Nutritionist', 'Trainer']
	counter = 0
	for letter in string.ascii_uppercase:
		email = 'pro_' + letter + '@test.com'
		password = 'admin123'
		pro = Professional.objects.get(email=email)
		title = 'pro_title_' +letter
		description = 'this is a description for video ' + title
		difficulty = ['beginner', 'intermediate', 'advanced']

		obj, created = Video.objects.get_or_create(user=pro, title=title,
													description=description, difficulty=difficulty[(counter+1)%3])
		
		obj.video_tags.add(tags[counter%3])
		
		
		
		
		counter += 1

create_workout_videos()