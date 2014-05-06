from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from django.contrib.auth import models as auth_models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.contrib.auth.models import BaseUserManager
from django.db.models.signals import post_save
from taggit.managers import TaggableManager
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        now = timezone.now()
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=UserManager.normalize_email(email),
            is_staff=False, is_active=True, is_superuser=False,
            last_login=now, date_joined=now, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        u = self.create_user(email, password, **extra_fields)
        u.is_staff = True
        u.is_active = True
        u.is_superuser = True
        u.save(using=self._db)
        return u


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    A fully featured User model with admin-compliant permissions that uses
    a full-length email field as the username.

    Email and password are required. Other fields are optional.
    """
    id = models.AutoField(primary_key=True, db_index=True)
    email = models.EmailField(_('email address'), max_length=50, unique=True)

    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
 
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(_('gender'), max_length=1, blank=True, choices=GENDER_CHOICES)

    twitter = models.CharField(_('twitter'), max_length=100, blank=True)
    facebook = models.CharField(_('facebook'), max_length=100, blank=True)
    instagram = models.CharField(_('instagram'), max_length=100, blank=True)
    youtube = models.CharField(_('youtube'), max_length=100, blank=True)
    linkedin = models.CharField(_('linkedin'), max_length=100, blank=True)
    plus = models.CharField(_('plus'), max_length=100, blank=True)
    url = models.CharField(_('url'), max_length=100, blank=True)
    #Image field requires the lib pillow
    img = models.ImageField(_('image'), upload_to="users", blank=True, default='default-pic.svg')
    bio = models.CharField(_('biography'), max_length=5000, blank=True)
    
    
    #primary_address = models.OneToOneField('Address', null=True, blank=True, on_delete=models.SET_NULL, related_name='owner')
    phone = models.CharField(_('phone'), max_length=10, blank=True, null=True, default='')
    

    is_upgraded = models.BooleanField(_('is upgraded'), default=False)
    is_staff = models.BooleanField(_('staff status'), default=False,
                                   help_text=_('Designates whether the user can log into this admin '
                                               'site.'))
    is_active = models.BooleanField(_('active'), default=True,
                                    help_text=_('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))
    
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def username(self):
        return getattr(self, self.USERNAME_FIELD)

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_absolute_url(self):
        return "/accounts/profile/"
        #return "/profile/view?id=%s" % urlquote(self.id)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def get_url(self):
        url = '/profile/view?id=%s' % (self.id)
        return url.strip()

    def email_user(self, subject, message, from_email=None):
        """Sends an email to this User."""
        send_mail(subject, message, from_email, [self.email])



@receiver(post_save, sender=CustomUser)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


