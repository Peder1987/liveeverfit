# -*- coding: utf-8 -*-
from django.contrib.contenttypes import generic
from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model
User = get_user_model()
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext, ugettext_lazy as _
from django.template.defaultfilters import slugify
import datetime
from dateutil import rrule


class CalendarManager(models.Manager):
    """
    >>> user1 = User(username='tony')
    >>> user1.save()
    """
    pass

class Calendar(models.Model):
    '''
    This is for grouping events so that batch relations can be made to all
    events.  An example would be a project calendar.

    name: the name of the calendar
    events: all the events contained within the calendar.
    >>> calendar = Calendar(name = 'Test Calendar')
    >>> calendar.save()
    >>> data = {
    ...         'title': 'Recent Event',
    ...         'start': datetime.datetime(2008, 1, 5, 0, 0),
    ...         'end': datetime.datetime(2008, 1, 10, 0, 0)
    ...        }
    >>> event = Event(**data)
    >>> event.save()
    >>> calendar.events.add(event)
    >>> data = {
    ...         'title': 'Upcoming Event',
    ...         'start': datetime.datetime(2008, 1, 1, 0, 0),
    ...         'end': datetime.datetime(2008, 1, 4, 0, 0)
    ...        }
    >>> event = Event(**data)
    >>> event.save()
    >>> calendar.events.add(event)
    >>> data = {
    ...         'title': 'Current Event',
    ...         'start': datetime.datetime(2008, 1, 3),
    ...         'end': datetime.datetime(2008, 1, 6)
    ...        }
    >>> event = Event(**data)
    >>> event.save()
    >>> calendar.events.add(event)
    '''

    user = models.ForeignKey(User, related_name='calendar')

    def events(self):
        return self.event_set.all()
    events = property(events)

    class Meta:
        verbose_name = _('calendar')
        verbose_name_plural = _('calendar')
        app_label = 'schedule'

    def __unicode__(self):
        return unicode(self.user.email)


    
