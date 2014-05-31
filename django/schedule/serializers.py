import ast, json
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from schedule.models import Calendar, Event



class EventSerializer(serializers.ModelSerializer):
	end = serializers.DateTimeField(required=False)
 
	class Meta:
		model = Event
		fields = ('id', 'start', 'end', 'title', 'description', 'creator', 'calendar', 'created_on')

	def validate_end(self, attrs, source):
		end = attrs['end']
		if end is None:
			attrs['end'] = attrs['start']
			return attrs
		else:
			return attrs

	def validate_calendar(self, attrs, source):
		creator = attrs['creator']
		attrs['calendar'] = Calendar.objects.get(user = creator)
		return attrs


class CalendarSerializer(serializers.ModelSerializer):
	events = EventSerializer(many=True, required=False)

	class Meta:
		model = Calendar
		fields = ('events',)
