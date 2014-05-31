from django.contrib import admin

from schedule.models import Calendar, Event, Rule

class CalendarAdmin(admin.ModelAdmin):
	list_display = ('user', )


class EventAdmin(admin.ModelAdmin):
	list_display = ('creator', 'title','start', 'end')


admin.site.register(Calendar, CalendarAdmin)
admin.site.register(Event, EventAdmin)
