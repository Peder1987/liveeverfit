import datetime
from django.utils.timezone import utc
from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
from django.conf import settings

expiration = getattr(settings, 'TOKEN_EXPIRE_DAYS', 14)

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        
        try:
            token = self.model.objects.get(key=key)
        except self.model.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        utc_now = datetime.datetime.utcnow().replace(tzinfo=utc)

        if token.created < utc_now - datetime.timedelta(days=expiration):
            raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)