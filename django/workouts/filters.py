import django_filters
from rest_framework import viewsets, status, filters

from .models import Video

class DifficultyFilterBackend(filters.BaseFilterBackend):

	def filter_queryset(self, request, queryset, view):
		if 'difficulty' in request.QUERY_PARAMS:
			difficulty = request.GET.getlist('difficulty','')
			try:
				queryset = queryset.filter(difficulty__in= difficulty)
			except:
				pass

		return queryset

	class Meta:
		model = Video


class WorkoutTagFilterBackend(filters.BaseFilterBackend):

	def filter_queryset(self, request, queryset, view):
		if 'tags' in request.QUERY_PARAMS:
			tags = request.GET.getlist('tags','')

			try:
				for tag in tags:
					special_list = [tag]
					queryset = queryset.filter(video_tags__name__in= tags).distinct()
				print queryset

			except:
				pass

		return queryset

	class Meta:
		model = Video
