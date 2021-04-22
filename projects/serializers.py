from dry_rest_permissions.generics import DRYPermissionsField
from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from projects.models import (
    Project,
    Invitation,
)
from users.serializers import BasicUserSerializer


class InvitationSerializer(serializers.ModelSerializer):
    url = serializers.URLField(source="get_frontend_abs_url")

    class Meta:
        model = Invitation
        exclude = ["project", 'id']


class AcceptInvitationSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(read_only=True, source='project.name')
    creator_name = serializers.CharField(read_only=True, source='project.creator.username')

    class Meta:
        model = Invitation
        fields = ["project_name", 'creator_name']


class BasicProjectSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    creator = BasicUserSerializer(read_only=True, default=serializers.CurrentUserDefault())
    is_creator = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "name", "creator", "is_creator"]

    def get_is_creator(self, obj) -> bool:
        user = self.context['request'].user
        return user == obj.creator

    def create(self, validated_data):
        name = validated_data.get('name')
        project = Project.objects.create(creator=self.context['request'].user, name=name)
        return project


class ProjectSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    creator = BasicUserSerializer()
    members = BasicUserSerializer(many=True)
    permissions = DRYPermissionsField()
    invitation = InvitationSerializer()

    class Meta:
        model = Project
        fields = ["id", "name", "creator", "members", "invitation", "permissions"]


class ProjectMembersSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    members = BasicUserSerializer(many=True)

    class Meta:
        model = Project
        fields = ["id", "members"]
