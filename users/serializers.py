from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from dj_rest_auth.registration.serializers import RegisterSerializer
from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from users.models import User, Profile


class RegistrationSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)
    email = serializers.EmailField(required=True)

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name'),
            'last_name' : self.validated_data.get('last_name'),
            'username'  : self.validated_data.get('username'),
            'email'     : self.validated_data.get('email'),
            'password1' : self.validated_data.get('password1')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='users.User.id', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email']


class ProfileSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='users.Profile.id', read_only=True)
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')
    teams = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='team_name', many=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'teams']
        depth = 1
