from django.contrib import admin

from feed.models import Entry, PhotoEntry, VideoEntry, EventEntry, BlogEntry, TextEntry, Comment


class FeedAdmin(admin.ModelAdmin):
	list_display = ('creator', 'title','start', 'end')

class EntryAdmin(admin.ModelAdmin):
	pass

class TextEntryAdmin(admin.ModelAdmin):
	pass

class PhotoEntryAdmin(admin.ModelAdmin):
	pass
class VideoEntryAdmin(admin.ModelAdmin):
	pass
class EventEntryAdmin(admin.ModelAdmin):
	pass
class BlogEntryAdmin(admin.ModelAdmin):
	pass
class CommentAdmin(admin.ModelAdmin):
	pass
admin.site.register(Entry, EntryAdmin)
admin.site.register(TextEntry, TextEntryAdmin)
admin.site.register(PhotoEntry, PhotoEntryAdmin)
admin.site.register(VideoEntry, VideoEntryAdmin)
admin.site.register(EventEntry, EventEntryAdmin)
admin.site.register(BlogEntry, BlogEntryAdmin)
admin.site.register(Comment, CommentAdmin)