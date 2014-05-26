from django.contrib import admin

from feed.models import Entry, PictureEntry, VideoEntry, EventEntry, BlogEntry


class FeedAdmin(admin.ModelAdmin):
	list_display = ('creator', 'title','start', 'end')

class EntryAdmin(admin.ModelAdmin):
	pass

class PictureEntryAdmin(admin.ModelAdmin):
	pass
class VideoEntryAdmin(admin.ModelAdmin):
	pass
class EventEntryAdmin(admin.ModelAdmin):
	pass
class BlogEntryAdmin(admin.ModelAdmin):
	pass

admin.site.register(Entry, EntryAdmin)
admin.site.register(PictureEntry, PictureEntryAdmin)
admin.site.register(VideoEntry, VideoEntryAdmin)
admin.site.register(EventEntry, EventEntryAdmin)
admin.site.register(BlogEntry, BlogEntryAdmin)