from chargify_settings import CHARGIFY, CHARGIFY_CC_TYPES

from django.db import models



class CreditCard(models.Model):

    tier = models.CharField(max_length=50, blank=True)
    full_number = models.CharField(max_length=50, blank=True)
    expiration_month = models.CharField(max_length=50, blank=True)
    expiration_year = models.CharField(max_length=50, blank=True)
    cvv = models.CharField(max_length=50, blank=True)
    creditcard_first_name = models.CharField(max_length=50, blank=True)
    creditcard_last_name = models.CharField(max_length=50, blank=True)
    billing_address = models.CharField(max_length=50, blank=True)
    billing_address_2 = models.CharField(max_length=50, blank=True)
    billing_city = models.CharField(max_length=50, blank=True)
    billing_state = models.CharField(max_length=50, blank=True)
    billing_zip = models.CharField(max_length=50, blank=True)
    billing_country = models.CharField(max_length=50, blank=True)