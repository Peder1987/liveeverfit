# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CreditCard'
        db.create_table(u'chargify_creditcard', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('tier', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('full_number', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('expiration_month', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('expiration_year', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('cvv', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('creditcard_first_name', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('creditcard_last_name', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('billing_address', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('billing_address_2', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('billing_city', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('billing_state', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('billing_zip', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('billing_country', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
        ))
        db.send_create_signal(u'chargify', ['CreditCard'])


    def backwards(self, orm):
        # Deleting model 'CreditCard'
        db.delete_table(u'chargify_creditcard')


    models = {
        u'chargify.creditcard': {
            'Meta': {'object_name': 'CreditCard'},
            'billing_address': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'billing_address_2': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'billing_city': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'billing_country': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'billing_state': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'billing_zip': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'creditcard_first_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'creditcard_last_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'cvv': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'expiration_month': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'expiration_year': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'full_number': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'tier': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'})
        }
    }

    complete_apps = ['chargify']