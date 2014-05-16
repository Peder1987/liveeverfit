
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
def create_professional_dummy_data():
	accepting = True
	tags = ["looksy", 'crossfit', 'fitness']
	profession_list = ['Nutritionist', 'Trainer']
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
			pro.profession = profession_list[counter%2]
			pro.tags.add(tags[counter%3])
			pro.save()
		accepting = not accepting
		counter += 1

create_professional_dummy_data()
