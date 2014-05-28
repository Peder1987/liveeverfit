#Django Libs
from django.contrib import auth
from django import forms
from django.forms import extras
#Python Libs
from time import time, gmtime, strftime
#Models
from feed.models import Entry, Flagged

from widgets.SelectTimeWidget import SelectTimeWidget, SplitSelectDateTimeWidget
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth import get_user_model
User = get_user_model()



class CustomUserChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        print obj
        return 'hey'   

class AddFlaggedForm(forms.ModelForm):
    entry = CustomUserChoiceField(queryset=Entry.objects.all().select_subclasses())
    def __init__(self, *args, **kwargs):

        return super(FlaggedForm, self).__init__(*args, **kwargs)
        
    class Meta:
        model = Flagged
        #fields = ("entry__text",)
