# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'CustomUser.tier'
        db.delete_column(u'user_app_customuser', 'tier')

        # Deleting field 'CustomUser.lng'
        db.delete_column(u'user_app_customuser', 'lng')

        # Deleting field 'CustomUser.lat'
        db.delete_column(u'user_app_customuser', 'lat')

        # Adding field 'Address.lat'
        db.add_column(u'user_app_address', 'lat',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=30, blank=True),
                      keep_default=False)

        # Adding field 'Address.lng'
        db.add_column(u'user_app_address', 'lng',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=30, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'CustomUser.tier'
        db.add_column(u'user_app_customuser', 'tier',
                      self.gf('django.db.models.fields.CharField')(default=1, max_length=30, null=True, blank=True),
                      keep_default=False)

        # Adding field 'CustomUser.lng'
        db.add_column(u'user_app_customuser', 'lng',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=30, blank=True),
                      keep_default=False)

        # Adding field 'CustomUser.lat'
        db.add_column(u'user_app_customuser', 'lat',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=30, blank=True),
                      keep_default=False)

        # Deleting field 'Address.lat'
        db.delete_column(u'user_app_address', 'lat')

        # Deleting field 'Address.lng'
        db.delete_column(u'user_app_address', 'lng')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'user_app.address': {
            'Meta': {'object_name': 'Address'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'corporation': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'country': ('django.db.models.fields.CharField', [], {'default': "'US'", 'max_length': '100', 'blank': 'True'}),
            'department': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'firstname': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lastname': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'lat': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'lng': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'postal_box': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'street_line1': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'street_line2': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'zipcode': ('django.db.models.fields.CharField', [], {'max_length': '5', 'blank': 'True'})
        },
        u'user_app.customuser': {
            'Meta': {'object_name': 'CustomUser'},
            'bio': ('django.db.models.fields.CharField', [], {'max_length': '5000', 'blank': 'True'}),
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'}),
            'facebook': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'gender': ('django.db.models.fields.CharField', [], {'max_length': '1', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'img': ('django.db.models.fields.files.ImageField', [], {'default': "'default-pic.svg'", 'max_length': '100', 'blank': 'True'}),
            'instagram': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_upgraded': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'linkedin': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'phone': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'plus': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'referred_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'user_reference'", 'null': 'True', 'to': u"orm['user_app.ExampleUser']"}),
            'twitter': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'youtube': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'})
        },
        u'user_app.exampleuser': {
            'Meta': {'object_name': 'ExampleUser', '_ormbases': [u'user_app.CustomUser']},
            'choices': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            u'customuser_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['user_app.CustomUser']", 'unique': 'True', 'primary_key': 'True'}),
            'is_accepting': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        }
    }

    complete_apps = ['user_app']