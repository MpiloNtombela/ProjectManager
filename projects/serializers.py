from dry_rest_permissions.generics import DRYPermissionsField
from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from projects.models import (
    Task,
    Board,
    TaskComment,
    TaskFeed,
    Subtask,
    Project,
    Invitation,
)
from users.models import User


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop("fields", None)
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


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


class ProjectUserSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="users.User.id", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "avatar"]


class BSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Board.id", read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name"]


class TaskSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Task.id", read_only=True)
    creator = ProjectUserSerializer(required=False)
    members = ProjectUserSerializer(required=False, many=True)
    can_edit = serializers.SerializerMethodField()
    board = BSerializer(required=False)

    class Meta:
        model = Task
        fields = ["id", "name", "can_edit", "board", "creator", "members"]

    def get_can_edit(self, obj) -> bool:
        """
        checks if user has perm to edit
        :param obj:
        :return:
        """
        user = self.context["request"].user
        return obj.user_part_of_task(user)

    @staticmethod
    def get_num_assigned(self, obj):
        return obj.members.all().count()


class BoardSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Board.id", read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "created_on"]


class ProjectSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    creator = ProjectUserSerializer()
    members = ProjectUserSerializer(many=True)
    permissions = DRYPermissionsField()
    invitation = InvitationSerializer()

    class Meta:
        model = Project
        fields = ["id", "name", "creator", "members", "invitation", "permissions"]


class ProjectMembersSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Project.id", read_only=True)
    members = ProjectUserSerializer(many=True)

    class Meta:
        model = Project
        fields = ["id", "members"]


class TaskCommentSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(
        source_field="projects.TaskComment.id", read_only=True
    )
    commenter = ProjectUserSerializer(required=False)

    class Meta:
        model = TaskComment
        fields = ["id", "commenter", "comment", "timestamp"]


class TaskFeedSerializer(serializers.ModelSerializer):
    user = ProjectUserSerializer()

    class Meta:
        model = TaskFeed
        fields = ["id", "feed", "user", "timestamp"]


class SubtaskSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Subtask.id", read_only=True)

    class Meta:
        model = Subtask
        fields = ["id", "name", "complete", "created_on", "updated_on"]


class TaskViewSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="projects.Task.id", read_only=True)
    creator = ProjectUserSerializer(required=False)
    members = ProjectUserSerializer(many=True, required=False)
    is_creator = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    subtasks = SubtaskSerializer(many=True, required=False)
    task_comments = TaskCommentSerializer(many=True, required=False)
    task_feed = TaskFeedSerializer(many=True, required=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "is_creator",
            "can_edit",
            "created_on",
            "deadline",
            "description",
            "creator",
            "members",
            "subtasks",
            "task_comments",
            "task_feed",
        ]

    def get_can_edit(self, obj) -> bool:
        user = self.context["request"].user
        return obj.user_part_of_task(user)

    def get_is_creator(self, obj) -> bool:
        user = self.context["request"].user
        return user == obj.creator

    