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
        exclude = ["project", "id"]


class AcceptInvitationSerializer(serializers.ModelSerializer):
    project_id = serializers.CharField(read_only=True, source="project.id")
    project_name = serializers.CharField(read_only=True, source="project.name")
    creator_name = serializers.CharField(
        read_only=True, source="project.creator.username"
    )
    part_of_project = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = ["project_id", "project_name", "creator_name", "part_of_project"]

    def get_part_of_project(self, obj):
        user = self.context["request"].user
        return obj.project.has_user(user)


# class BasicProjectSerializer(serializers.ModelSerializer):
#     id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
#     creator = BasicUserSerializer(read_only=True, default=serializers.CurrentUserDefault())
#     is_creator = serializers.SerializerMethodField()

#     class Meta:
#         model = Project
#         fields = ["id", "name", "creator", "is_creator"]

#     def get_is_creator(self, obj) -> bool:
#         user = self.context['request'].user
#         return user == obj.creator

#     def create(self, validated_data):
#         name = validated_data.get('name')
#         project = Project.objects.create(creator=self.context['request'].user, name=name)
#         return project


class ProjectSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    creator = BasicUserSerializer(required=False)
    is_creator = serializers.SerializerMethodField()
    members = BasicUserSerializer(many=True, required=False)
    permissions = DRYPermissionsField()

    class Meta:
        model = Project
        fields = ["id", "name", "creator", "is_creator", "members", "permissions"]

    def get_is_creator(self, obj) -> bool:
        user = self.context['request'].user
        return user == obj.creator

    def create(self, validated_data):
        name = validated_data.get("name")
        project = Project.objects.create(
            creator=self.context["request"].user, name=name
        )
        return project


class ProjectMembersSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    members = BasicUserSerializer(many=True)

    class Meta:
        model = Project
        fields = ["id", "members"]
