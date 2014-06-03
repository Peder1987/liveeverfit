import ast, json
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from schedule.models import Calendar, Event



class EventSerializer(serializers.ModelSerializer):
	end = serializers.DateTimeField(required=False, format=None, input_formats=None)
	start = serializers.DateTimeField(format=None, input_formats=None)
 
	class Meta:
		model = Event
		fields = ('id', 'start', 'end', 'title', 'description', 'creator', 'calendar', 'created_on', 'allDay', 'user')

	def validate_end(self, attrs, source):
		end = attrs.get('end')
		if end is None:
			attrs['end'] = attrs.get('start')
			return attrs
		else:
			return attrs

	def validate_calendar(self, attrs, source):
		creator = attrs.get('creator')
		attrs['calendar'] = Calendar.objects.get(user = creator)
		return attrs

	def validate_title(self, attrs, source):
		title = attrs.get('title')
		attrs['text'] = title
		return attrs


class CalendarSerializer(serializers.ModelSerializer):
	events = EventSerializer(many=True, required=False)

	class Meta:
		model = Calendar
		fields = ('events',)
