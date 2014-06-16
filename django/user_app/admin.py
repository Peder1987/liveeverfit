import csv
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.template import RequestContext
from django.template.loader import get_template
from django.http import HttpResponse
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import models as auth_models
from django.utils.safestring import mark_safe
from django.core.urlresolvers import reverse
from django.core.mail import send_mail, EmailMessage

from user_app.models import CustomUser, Address, Professional, UniqueLocation, Certification, FeaturedProfessional, StaticTags
from user_app.forms import CustomUserChangeForm, CustomUserCreationForm



class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin

    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'tier', 'gender', 'primary_address',  
                                             'following', 'address')}),
        (_('Professional Fields'), {'fields': ('referred_by', 'connection', 'connected_on',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions', 'is_upgraded')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_upgraded')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)


def export_as_csv(modeladmin, request, queryset):
    """
    Generic csv export admin action.
    based on http://djangosnippets.org/snippets/1697/
    HIGHLY MODIFIED, quick code to finish :p 
    """
    opts = modeladmin.model._meta
    field_names = set([field.name for field in opts.fields])
    fields = ['first_name', 'last_name', 'shopify_sales']
    if fields:
        fieldset = set(fields)
        field_names = field_names & fieldset
    elif exclude:
        excludeset = set(exclude)
        field_names = field_names - excludeset

    response = HttpResponse(mimetype='text/csv')
    response['Content-Disposition'] = 'attachment; filename=%s.csv' % unicode(opts).replace('.', '_')
    writer = csv.writer(response)
    if True:
        writer.writerow(list(field_names))
    for obj in Professional.objects.all():
        shopifyObj = obj.shopify_sales()
        try:
            sales = shopifyObj['total_earned']
        except:
            sales = 'No_Shopify_Account'

        try:
            customers = shopifyObj['total_customers']
        except:
            customers = 'No_Shopify_Account'

        writer.writerow([obj.first_name, obj.last_name, obj.email, sales, customers])

    return response

def make_active(modeladmin, request, queryset):
    for obj in queryset:
        obj.queue = False
        obj.save()
        

def make_inactive(modeladmin, request, queryset):
    for obj in queryset:
        obj.queue = True
        obj.save()

class ProfessionalAdmin(UserAdmin):
    # The forms to add and change user instances
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin

    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'gender' , 'profession', 'location', 'lat', 'lng', "phone", 'is_accepting')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Certifications'), {'fields': ("certification_name1", "certification_number1", "certification_name2", "certification_number2",)}),
        (_('Social Media'), {'fields': ("twitter", "facebook", "instagram", "youtube", "linkedin", "plus", )}),
        (_('Tags'), {'fields': ('tags', )}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    list_display = ('email', 'first_name', 'last_name', 'queue')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    actions = [make_active, make_inactive, export_as_csv] 

admin.site.register(Professional, ProfessionalAdmin)

class FeaturedProfessionalAdmin(admin.ModelAdmin):
    list_display = ('professional',)



admin.site.register(FeaturedProfessional ,FeaturedProfessionalAdmin)
admin.site.register(StaticTags)
admin.site.register(UniqueLocation)
admin.site.register(Address)
admin.site.register(Certification)