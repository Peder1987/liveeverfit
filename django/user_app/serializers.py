from django import forms
from django.contrib.auth.models import Group, Permission
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework import serializers
from user_app.models import Professional, UniqueLocation, Certification, Address

# This importation is implemented due to 
# django and MTI (Multi Table inheritance)
# not allowing to do a reverse table lookup for
# a specific entry rather only the generic "Entry"
from feed.models import SharedEntry

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        exclude = ('user',)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('city', 'state')


class SettingsProfessionalSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    certifications = CertificationSerializer(many=True, allow_add_remove=True)
    tags = serializers.Field(source='tags.all')
    def to_native(self, value):
        obj = super(SettingsProfessionalSerializer, self).to_native(value)
        return obj
    class Meta:
        model = Professional
        exclude = ('password', 'is_superuser', 'connection', 'groups', 'user_permissions', "customer_list")


class SettingsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id', required=True)  
    first_name = serializers.CharField(source='first_name', required=False)
    last_name = serializers.CharField(source='last_name', required=False)
    email = serializers.EmailField(source='email', required=False)
    last_login_on = serializers.DateTimeField(source='last_login',read_only=True)
    joined_on = serializers.DateTimeField(source='date_joined', read_only=True)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    referred_by = SettingsProfessionalSerializer(required=False)
    primary_address = AddressSerializer(required=False)

    class Meta:
        model = User
        exclude = ('password', 'is_superuser', 'connection', 'groups', 'user_permissions',)

    def to_native(self, value):
        obj = super(SettingsSerializer, self).to_native(value)
        user_tier = obj.get('tier')
        user_id = obj.get('id')
        if user_tier == 7 or user_tier == 6:
            if Professional.objects.filter(pk = user_id).exists():
                pro = Professional.objects.get(pk=user_id)
                obj = SettingsProfessionalSerializer(instance=pro).data
                obj['shopify_sales'] = pro.shopify_sales()
            obj['type'] = 'professional'
        elif user_tier <= 5 and user_tier >= 2:
            obj['type'] = 'upgraded'
        else:
            obj['type'] = 'user'
        return obj


class ProfileProfessionalSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    certifications = CertificationSerializer(many=True, allow_add_remove=True)
    tags = serializers.Field(source='tags.all')
    likes = serializers.Field(source="likes.count")
    def to_native(self, value):
        obj = super(ProfileProfessionalSerializer, self).to_native(value)
        obj['clients'] = value.user_connections.count()
        return obj
    class Meta:
        model = Professional
        exclude = ('password', 'is_superuser', 'connection', 'groups', 'user_permissions', "customer_list",
                    'tier', 'referred_by', 'shopify_id', 'chargify_id', 'stripe_id', 'phone', 'is_professional',
                    'is_upgraded', 'is_superuser', 'primary_address', 'is_staff', 'queue', 'following', 'relationships')

    
class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id', required=True)  
    first_name = serializers.CharField(source='first_name', required=False)
    last_name = serializers.CharField(source='last_name', required=False)
    last_login_on = serializers.DateTimeField(source='last_login',read_only=True)
    joined_on = serializers.DateTimeField(source='date_joined', read_only=True)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    likes = serializers.Field(source="likes.count")
    
    class Meta:
        model = User
        exclude = ('password', 'is_superuser', 'connection', 'groups', 'user_permissions', 'primary_address', 'following', 'relationships')
        
    def to_native(self, value):
        obj = super(ProfileSerializer, self).to_native(value)
        user_tier = obj.get('tier')
        user_id = obj.get('id')
        if user_tier == 7 or user_tier == 6:
            if Professional.objects.filter(pk = user_id).exists():
                pro = Professional.objects.get(pk=user_id)
                obj = ProfileProfessionalSerializer(instance=pro).data
            obj['type'] = 'professional'
        elif user_tier <= 5 and user_tier >= 2:
            obj['type'] = 'upgraded'
        else:
            obj['type'] = 'user'
        #data about user logged in accessing this profile   
        user = self.context['request'].user

        obj['user_fanatics'] = user.relationships.followers().count()
        obj['user_inspiration'] = SharedEntry.objects.filter(user=user).count() +  user.comments.count()
        # if the value of USER is the same as the logged in users
        # connection then they are connected
        try:
            if value.pk == user.connection.pk:
                obj['user_connected'] = True
            else:
                obj['user_connected'] = False
        except:
            obj['user_connected'] = False

        # check if user is following this profile
        if value.relationships.followers().filter(pk=user.pk).exists():
            obj['user_follows'] = True
        else:
            obj['user_follows'] = False

        # If logged in user likes this user
        obj['user_likes'] = value.likes.filter(pk=user.pk).exists()
        return obj


class UserLikeSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ('id', "user_id",)

    def to_native(self, value):
        obj = super(UserLikeSerializer, self).to_native(value)
        user = User.objects.get(email=obj['user_email'])
        # best quick solution for M2M, django doesn't provide
        # a clean solution.
        if value.likes.filter(pk=user.pk).exists():
            obj['user_likes'] = False
            value.likes.remove(user)
        else:
            obj['user_likes'] = True
            value.likes.add(user)

        return obj

class FollowUserSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ('id', "user_id",)

    def to_native(self, value):
        obj = super(FollowUserSerializer, self).to_native(value)
        user = User.objects.get(id=obj['user_id'])
        
        #print value.relationships.add(user)
        print value.relationships.following()
        if value.relationships.following().filter(pk=user.pk).exists():
            obj['user_follows'] = False
            print 'unfollowing'
            value.relationships.remove(user)
        else:
            print 'following'
            obj['user_follows'] = True
            value.relationships.add(user)

        return obj

class ConnectUserSerializer(serializers.ModelSerializer):
    professional_id = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ('id', "professional_id",)

    def to_native(self, value):
        obj = super(ConnectUserSerializer, self).to_native(value)
        print obj

        value.connection = Professional.objects.get(pk=obj['professional_id'])
        value.save()
        obj['user_connected'] = True

        return obj

    def validate_professional_id(self, attrs, source):

        if Professional.objects.filter(pk=attrs['professional_id']).exists():
            pass
        else:
            raise serializers.ValidationError("Must be a Professional")

        return attrs


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueLocation
        fields = ('location',)


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        widget=forms.PasswordInput(),
        required=False
    )


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    permissions = serializers.SlugRelatedField(many=True,
                                               slug_field='codename',
                                               queryset=Permission.objects.all())

    class Meta:
        model = Group
        fields = ('url', 'name', 'permissions')


class ProfessionalListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    img = serializers.ImageField(allow_empty_file=True, required=False)
    class Meta:
        model = Professional
        fields = ('id',"first_name", "last_name", "profession", "gender", "location", "is_accepting", "img", 'lat', 'lng', 'queue',)


class ClientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name',)


class ModifyMembershipSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='email', required=False)
    
    class Meta:
        model = User

    def to_native(self, value):
        #do not use this function until it's fix, this does not modify, it only cancels the membership
        obj = super(ModifyMembershipSerializer,self).to_native(value)
        value.stripe_cancel_subscription()
        value.cancel_professional()

        
class CreditcardSerializer(serializers.ModelSerializer):
    creditcard = serializers.Field(source='stripe_get_creditcard')

    class Meta:
        model = User
        fields = ('id', 'creditcard',)


class PaymentSerializer(serializers.ModelSerializer):
    stripeToken = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id','stripeToken',)

    def to_native(self, value):
        obj = super(PaymentSerializer,self).to_native(value)
        stripe_token = obj.get('stripeToken')
        value.stripe_edit_creditcard(stripe_token)
        value.stripe_update_subscription()



class RelationshipTypeAheadSerializer(serializers.ModelSerializer):
    # def to_native(self, value):
    #     print value
    #     return {"name": 'value.title'}

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name',)