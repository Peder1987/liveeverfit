import django_filters
from django.utils.timezone import utc, now
from rest_framework import filters
from rest_framework import generics

# class DatetimeFilterBackend(filters.BaseFilterBackend):
# 	"""
# 	Giving month or year in query parameters allows to filter 
# 	by either or
# 	"""
# 	def filter_queryset(self, request, queryset, view):
# 		if 'month' in request.QUERY_PARAMS:
# 			month = request.QUERY_PARAMS['month']
# 			try:
# 				queryset = queryset.filter(start__month=month)
# 			except:
# 				pass

# 		if 'year' in request.QUERY_PARAMS:
# 			year = request.QUERY_PARAMS['year']
# 			try:
# 				queryset = queryset.filter(start__year=year)
# 			except:
# 				pass

# 		return queryset

# 	class Meta:
# 		model = Event