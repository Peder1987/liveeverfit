import django_filters
from rest_framework import viewsets, status, filters
from .models import Professional
from django.contrib.auth import get_user_model
User = get_user_model()

class UserFilter(django_filters.FilterSet):

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'gender',]


class GenderFilterBackend(filters.BaseFilterBackend):

	def filter_queryset(self, request, queryset, view):
		if 'gender' in request.QUERY_PARAMS:
			gender = request.GET.getlist('gender','')
			try:
				queryset = queryset.filter(gender__in= gender)
			except:
				pass

		return queryset

	class Meta:
		model = Professional


class ProfessionFilterBackend(filters.BaseFilterBackend):

	def filter_queryset(self, request, queryset, view):
		if 'profession' in request.QUERY_PARAMS:
			profession = request.GET.getlist('profession','')
			print request.GET
			print profession
			try:
				queryset = queryset.filter(profession__in= profession)
				print queryset
			except:
				pass

		return queryset

	class Meta:
		model = Professional
