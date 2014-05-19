from pychargify.api import *
from django.conf import settings
CHARGIFY_SUBDOMAIN = getattr(settings, "CHARGIFY_SUBDOMAIN", None)
CHARGIFY_API_KEY = getattr(settings, 'CHARGIFY_API_KEY', None)
chargify = Chargify(CHARGIFY_API_KEY, CHARGIFY_SUBDOMAIN)
from models import CreditCard

import stripe
tier_handle_choices = {
		        2 :'tier-2',
		        3 :'tier-3',
		        4 :'tier-4',
		        5 :'tier-5',
		        6 :'grandfather-trainer',
		        7 :'professional'
			}

# Not wanting to change a lot of attributes and have to retest
# making a reverse tier_handler
reverse_tier_handle_choices = {
		        'tier-2':2 ,
		         'tier-3' :3,
		         'tier-4' :4,
		         'tier-5' :5,
		         'grandfather-trainer':6,
		         'professional':7,
			}


def get_create_customer(self): #stripey_get_create
	"""
	quite messy, but for any circumstance it will find a customer
	else create a customer for stripe.
	Need to add scenarios of 100+ users (maintance contract)
	"""

	if not self.stripe_id:
		all_customers = stripe.Customer.all(count=100, offset=0) #offset for pagination
		all_customers = all_customers['data']
		for customer in all_customers:
			if customer.email == self.email:
				self.stripe_id = customer.id
				self.save()
			 	return customer
		response = stripe.Customer.create(
		  email=self.email,
		)
		self.stripe_id = response['id']
	else:
		#searc through all customers first before creating
		# if customer was deleted, then recreate (in case of commited db)
		try:
			response = stripe.Customer.retrieve(self.stripe_id)
			if 'deleted' in  response:
				all_customers = stripe.Customer.all(count=100, offset=0) #offset for pagination
				all_customers = all_customers['data']
				for customer in all_customers:
					if customer.email == self.email:
						self.stripe_id = customer.id
						self.save()
			 			return	customer


			 	response = stripe.Customer.create(
				  email=self.email,
				)
				self.stripe_id = response['id']
		except stripe.error.InvalidRequestError:
			"""
			Invalid request
			"""
			response = stripe.Customer.create(
				  email=self.email,
				)
			self.stripe_id = response['id']

	self.save()
	return response

def get_or_create_creditcard(customer, stripToken):
	default_card =  customer.default_card

	if default_card:
		card = customer.cards.retrieve(default_card)
	else:
		try:
			card =customer.cards.create(card=stripToken)
		except Exception as e:
			return {'creditcard':str(e)}
	return card

def delete_creditcard(customer):
	default_card = customer.default_card
	if default_card:
		customer.cards.retrieve(default_card).delete()

def get_creditcard(self):
	customer = self.stripe_get_create_customer()
	if self.stripe_id:
		default_card =  customer.default_card
		if default_card:
			card = customer.cards.retrieve(default_card)
			return card
		else:
			return 
		
	
def subscribe(self, **kwargs): # chargify_credit_card
	"""
	NOTE!!!
	Due to finishing up and not having to rename everything from
	chargify to stripe, everything is left as is and this function
	handles subscription
	only allowing 1 credit card as of now
	"""
	global tier_handle_choices
	stripToken = kwargs['stripToken']
	tier = kwargs['tier']
	tier_handle = tier_handle_choices[int(tier)]
	#ensures account existing for the following
	customer = self.stripe_get_create_customer()
	old_card = customer.default_card
	try:
		#given strip token create new card
		card = customer.cards.create(card=stripToken)
	except Exception as e:
		print e
		return {'creditcard':str(e)}
	customer.default_card = card
	if old_card:
		# if old card is existent then delete and replace with new
		# card
		customer.cards.retrieve(old_card).delete()
	# NOTE
	# to stay consistent with rest of code, doing error handling as in lef_website/views
	# only update stripe to tier classes, if a professional wants to get
	# moved to a professional tier, they have to manually get approved

	self.save()
	if int(tier) in range(2, 6):
		
		self.stripe_update_subscription(tier_handle)
	

def delete_customer(self):
	customer = self.stripe_get_create_customer()
	customer = stripe.Customer.retrieve(self.stripe_id)
	customer.delete()


def edit_creditcard(self, edit_info):
	"""
	Pass a dictionary of creditcard attributes to update
	example:
	edit_info = {'name' : 'pocho'}

	edit_creditcard(customer, edit_info)
	"""
	stripToken = edit_info
	customer = self.stripe_get_create_customer()
	old_card = customer.default_card
	try:
		card = customer.cards.create(card=stripToken)
	except Exception as e:
		print e
		return {'creditcard':str(e)}



	customer.default_card = card
	if old_card:
		# only need 1 card to charge
		
		customer.cards.retrieve(old_card).delete()
		
	

		

	#delete_creditcard(customer)
	
	# for key, value in edit_info.iteritems():
	# 	setattr(card, key, value)
	# card.save()

def update_subscription(self, tier_handle):
	"""
	tier handle is what the subscription is called,
	prorate handles if a user decides to change tiers
	example tier_handle = 'tier-4'
	"""
	global reverse_tier_handle_choices
	# this is to get the number version of a tier
	tier = reverse_tier_handle_choices[tier_handle]

	if tier in range(2,6):
		
		self.tier = tier
		self.save()
	customer = self.stripe_get_create_customer()
	customer.update_subscription(plan=tier_handle, prorate="True")

def cancel_subscription(self):
	customer = self.stripe_get_create_customer()
	try:
		customer.update_subscription(plan='cancel-subscription', prorate="True")		
		customer.cancel_subscription(at_period_end=True)
	except stripe.error.InvalidRequestError:
		pass # no subscription available, do nothing and 
		# downgrade to tier one
	# default to tier 1 when canceling
	self.tier = 1
	self.save()
	#{'status':'success'}