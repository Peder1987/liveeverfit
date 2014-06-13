from datetime import timedelta
from django.utils.timezone import utc, now
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action, link
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import generics, mixins
from django.contrib.auth import get_user_model
User = get_user_model()
from notifications import notify

from feed.permissions import IsOwnerOrReadOnly, ProfessionalOnly
from feed.serializers import EntrySerializer, TextEntrySerializer, PhotoEntrySerializer, VideoEntrySerializer, EventEntrySerializer
from feed.serializers import BlogEntrySerializer, CommentSerializer, FlaggedSerializer, EntryLikeSerializer, ListEntrySerializer
from feed.serializers import SharedEntrySerializer, RelationshipTypeAheadSerializer, EntryObjSerializer
from feed.models import TextEntry, PhotoEntry, VideoEntry, BlogEntry, SharedEntry, Entry, Comment, Flagged
from schedule.models.events import Event
from user_app.models import Professional



class EntryListView(generics.ListAPIView):
	paginate_by = 21
	serializer_class = EntrySerializer	
	permission_classes = (IsOwnerOrReadOnly,)
	filter_backends = (filters.OrderingFilter,)
	ordering = ('-created',)
	
	def get_queryset(self):
		pk = self.kwargs.get('pk', None)
		if pk:
			try: 
				user = User.objects.get(pk=pk)
				if self.request.user in user.relationships.blocking() or self.request.user in user.relationships.blockers():
					raise # raise exception to return empty 
				return Entry.objects.filter(user=pk).select_subclasses()
			except:
				#User id doesn't exist, return empty array
				return Entry.objects.none()
		else:
			#RETURNS LIST OF USERS THAT USER IS FOLLOWING
			following = self.request.user.relationships.following()
			blocking = self.request.user.relationships.blocking()
			blockers = self.request.user.relationships.blockers()
			qs= Entry.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers).select_subclasses()
									
			qs2 = Entry.objects.filter(user=self.request.user)
			return qs | qs2


class EntryView(generics.RetrieveAPIView):
	model = Entry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = EntryObjSerializer


class TextEntryViewSet(viewsets.ModelViewSet):
	model = TextEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = TextEntrySerializer

	def get_queryset(self):
		following = self.request.user.relationships.following()
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		qs= TextEntry.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers)
		qs2 = TextEntry.objects.filter(user=self.request.user)
		return qs | qs2


class PhotoEntryViewSet(viewsets.ModelViewSet):
	model = PhotoEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = PhotoEntrySerializer

	def get_queryset(self):
		following = self.request.user.relationships.following()
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		qs= PhotoEntry.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers)
		qs2 = PhotoEntry.objects.filter(user=self.request.user)
		return qs | qs2
	

class VideoEntryViewSet(viewsets.ModelViewSet):
	model = VideoEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = VideoEntrySerializer

	def get_queryset(self):
		following = self.request.user.relationships.following()
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		qs= VideoEntry.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers)
		qs2 = VideoEntry.objects.filter(user=self.request.user)
		return qs | qs2
	

class EventEntryViewSet(viewsets.ModelViewSet):
	model = Event
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = EventEntrySerializer

	def get_queryset(self):
		following = self.request.user.relationships.following()
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		qs= Event.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers)
		qs2 = Event.objects.filter(user=self.request.user)
		return qs | qs2


class BlogEntryViewSet(viewsets.ModelViewSet):
	model = BlogEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = BlogEntrySerializer

	def get_queryset(self):
		following = self.request.user.relationships.following()
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		qs= BlogEntry.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers)
		qs2 = BlogEntry.objects.filter(user=self.request.user)
		return qs | qs2


class SharedEntryViewSet(viewsets.ModelViewSet):
	model = SharedEntry
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = SharedEntrySerializer

	def get_queryset(self):
		following = self.request.user.relationships.following()
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		qs= SharedEntry.objects.filter(user__in=following).exclude(user__in=blocking).exclude(user__in=blockers)
		qs2 = SharedEntry.objects.filter(user=self.request.user)
		return qs | qs2


class CommentViewSet(viewsets.ModelViewSet):
	model = Comment
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = CommentSerializer
	
	def post_save(self, obj, created=False):
		notify.send(self.request.user, recipient=obj.entry.user, verb=u'left you a comment!')


class FlaggedCreateView(generics.CreateAPIView):
	model = Flagged
	permission_classes = (IsOwnerOrReadOnly,)
	serializer_class = FlaggedSerializer


class EntryLikeView(generics.UpdateAPIView, generics.DestroyAPIView):
    model = Entry
    permission_classes = (IsAuthenticated,)
    serializer_class = EntryLikeSerializer

    def update(self, request, pk=None):
    	user = User.objects.get(id = request.DATA.get('user_id'))
    	entry =  Entry.objects.get(pk = pk)
        if entry.likes.filter(pk = user.pk).exists():
        	entry.likes.remove(user)
        	return Response({'user_likes':'false'}, status=status.HTTP_200_OK)
        else:
        	notify.send(self.request.user, recipient=entry.user, verb=u'liked your status')
        	entry.likes.add(user)
        	return Response({'user_likes':'true'}, status=status.HTTP_200_OK)


class GroupEntryView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = EntrySerializer
	def get_queryset(self):
		type = self.kwargs.get('type', None)
		tag_name = self.kwargs.get('tag_name', None)
		blocking = self.request.user.relationships.blocking()
		blockers = self.request.user.relationships.blockers()
		if tag_name and not type:
			return Entry.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers).select_subclasses()
		elif tag_name and type:
			if type == 'text':
				return TextEntry.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers)
			elif type == 'photo':
				return PhotoEntry.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers)
			elif type == 'video':
				return VideoEntry.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers)
			elif type == 'event':
				return Event.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers)
			elif type == 'blog':
				return BlogEntry.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers)
			elif type == 'shared':
				return SharedEntry.objects.filter(tags__name=tag_name).exclude(user__in=blocking).exclude(user__in=blockers)
			return []
		else:
			return []

class ListSubEntryView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = ListEntrySerializer
	def get_queryset(self):
		pk = self.kwargs.get('pk', None)
		type = self.kwargs.get('type', None)
		if User.objects.filter(pk=pk).exists() and type:
			user = User.objects.get(pk=pk)
			if self.request.user in user.relationships.blocking() or self.request.user in user.relationships.blockers():
				return []
			if type == 'text':
				return TextEntry.objects.filter(user=pk).all()
			elif type == 'photo':
				return PhotoEntry.objects.filter(user=pk).all()
			elif type == 'video':
				return VideoEntry.objects.filter(user=pk).all()
			elif type == 'event':
				return Event.objects.filter(user=pk).all()
			elif type == 'blog':
				return BlogEntry.objects.filter(user=pk).all()
			elif type == 'shared':
				return SharedEntry.objects.filter(user=pk).all()
			return []
		else:
			return []

class ClientListView(generics.ListAPIView):
	paginate_by = 21
	serializer_class = EntrySerializer	
	permission_classes = (ProfessionalOnly,)
	filter_backends = (filters.OrderingFilter,)
	ordering = ('-created',)
	
	def get_queryset(self):
		pro = Professional.objects.get(id=self.request.user.id)
		connections = pro.user_connections.all()
		return Entry.objects.filter(user__in=connections).select_subclasses()


class ClientFilterView(generics.ListAPIView):
	permission_classes = (ProfessionalOnly,)
	serializer_class = ListEntrySerializer
	def get_queryset(self):
		type = self.kwargs.get('type', None)
		pro = Professional.objects.get(id=self.request.user.id)
		connections = pro.user_connections.all()
		if type:
			if type == 'text':
				return TextEntry.objects.filter(user__in=connections).all()
			elif type == 'photo':
				return PhotoEntry.objects.filter(user__in=connections).all()
			elif type == 'video':
				return VideoEntry.objects.filter(user__in=connections).all()
			elif type == 'event':
				return Event.objects.filter(user__in=connections).all()
			elif type == 'blog':
				return BlogEntry.objects.filter(user__in=connections).all()
			elif type == 'shared':
				return SharedEntry.objects.filter(user__in=connections).all()
			return []
		else:
			return []


class RelationshipTypeAheadView(generics.ListAPIView):   
    serializer_class = RelationshipTypeAheadSerializer
    model = User
    permission_classes = (IsAuthenticated,)
    search_fields = ('email', )

    def get_queryset(self):
        user =  self.request.user
        qs = user.relationships.followers()
        qs2 = user.relationships.following()
        #add pro you are connected to
        try:
        	user_id = user.connection.id
        	pro = User.objects.filter(id=user_id)
        	qs = qs|pro
        except:
        	pass

        qs3 = qs | qs2 
        return qs3.distinct()
