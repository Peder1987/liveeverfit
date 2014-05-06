from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from django.contrib.auth import models as auth_models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.contrib.auth.models import BaseUserManager
from django.db.models.signals import post_save
from taggit.managers import TaggableManager
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save



class AddressManager(models.Manager):
    def empty_address(self):
        new_address = self.model()
        new_address.save()
        return new_address

    def get_primary(self):
        pass

class Address(models.Model):
    """
    Standard Address Model:

    
    If needing in a specific format such as street_line1 should billing_street_line1
    write a custom function to deliver your data specified
    Typically custom functions used for using a 3rd party API such as Stripe or Shopify
    """
    TYPES_CHOICES = (
        ('HOME', 'Home'),
        ('WORK', 'Work'),
        ('OTHER', 'Other'),
    ) 
    type = models.CharField(_('Type'), max_length=20, choices = TYPES_CHOICES, blank=True,)
    firstname = models.CharField(_('Firstname'), max_length = 50, blank = True)
    lastname = models.CharField(_('Lastname'), max_length = 50, blank = True)
    department = models.CharField(_('Departement'), max_length = 50, blank = True)
    corporation = models.CharField(_('Corporation'), max_length = 100, blank = True)
    street_line1 = models.CharField(_('Address 1'), max_length = 100, blank = True)
    street_line2 = models.CharField(_('Address 2'), max_length = 100, blank = True)
    zipcode = models.CharField(_('ZIP code'), max_length = 5, blank = True)
    city = models.CharField(_('City'), max_length = 100, blank = True)
    state = models.CharField(_('State'), max_length = 100, blank = True)
    postal_box = models.CharField(_('Postal box'), max_length = 20, blank = True)
    country = models.CharField(_('Country'), max_length = 100, blank = True, default='US')
    objects = AddressManager()

    lat = models.CharField(_('latitude'), max_length=30, blank=True)
    lng = models.CharField(_('longitude'), max_length=30, blank=True)

    def __unicode__(self):
        return self.street_line1

    class Meta:
        verbose_name_plural = "Address"


    def shopify_format(self):
        """A consistant dictionary that matches shopifies
        """
        return {
            'province': self.state, 'city': self.city, 'first_name': self.owner.first_name, 'last_name': self.owner.last_name,
            'zip': self.zipcode, 'default': True, 'address1': self.street_line1,
            'address2': self.street_line2, 'phone': self.owner.phone, 'country': self.country, 'company': self.corporation
        }

    def custom_format(self):
        """A consistant dictionary that matches custom needs 
        """
        return {
            'state': self.state, 'city': self.city, 'first_name': self.owner.first_name, 'last_name': self.owner.last_name,
            'zip': self.zipcode, 'default': True, 'billing_address1': self.street_line1,
            'billing_address2': self.street_line2, 'phone': self.owner.phone, 'country': self.country, 'company': self.corporation
        }
