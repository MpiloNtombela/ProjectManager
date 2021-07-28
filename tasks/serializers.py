from dry_rest_permissions.generics import DRYPermissionsField
from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from users.serializers import BasicUserSerializer
from tasks.models import TaskComment, TaskLog, Subtask, Task
from boards.models import Board


class TaskCommentSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(
        source_field="tasks.TaskComment.id", read_only=True
    )
    commenter = BasicUserSerializer(required=False)

    class Meta:
        model = TaskComment
        fields = ["id", "commenter", "comment", "timestamp"]


class TaskLogSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer()

    class Meta:
        model = TaskLog
        fields = ["id", "log", "user", "timestamp"]


class SubtaskSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="tasks.Subtask.id", read_only=True)

    class Meta:
        model = Subtask
        fields = ["id", "name", "complete", "created_on", "updated_on"]


class BSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="boards.Board.id", read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name']



class TaskViewSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="tasks.Task.id", read_only=True)
    creator = BasicUserSerializer(required=False)
    board = BSerializer(required=False)
    members = BasicUserSerializer(many=True, required=False)
    is_creator = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    subtasks = SubtaskSerializer(many=True, required=False)
    task_comments = TaskCommentSerializer(many=True, required=False)
    task_logs = TaskLogSerializer(many=True, required=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "is_creator",
            "can_edit",
            "created_on",
            "deadline",
            'moved_at',
            "description",
            "creator",
            "members",
            "subtasks",
            "task_comments",
            "task_logs",
            "board",
        ]

    def get_can_edit(self, obj) -> bool:
        user = self.context["request"].user
        return obj.user_part_of_task(user)

    def get_is_creator(self, obj) -> bool:
        user = self.context["request"].user
        return user == obj.creator


class TaskSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="tasks.Task.id", read_only=True)
    creator = BasicUserSerializer(required=False)
    members = BasicUserSerializer(required=False, many=True)
    can_edit = serializers.SerializerMethodField()
    board_name = serializers.CharField(source="board.name", required=False)
    permissions = DRYPermissionsField()

    class Meta:
        model = Task
        fields = ["id", "name", "can_edit", "board_name", "creator", 'moved_at', "members", 'permissions']

    def get_can_edit(self, obj) -> bool:
        """
        checks if user has perm to edit
        :param obj:
        :return:
        """
        user = self.context["request"].user
        return obj.user_part_of_task(user)

    @staticmethod
    def get_num_assigned(obj):
        return obj.members.all().count()
