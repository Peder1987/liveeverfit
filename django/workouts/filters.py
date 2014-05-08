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
