from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from projects.models import Task, Board, TaskComment, TaskFeed, MiniTask
from users.models import User


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ProjectUserSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='users.User.id', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']


class TaskSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='projects.Task.id', read_only=True)
    creator = ProjectUserSerializer(required=False)
    assigned = ProjectUserSerializer(many=True, required=False)
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'name', 'creator', 'assigned', 'can_edit']

    def get_can_edit(self, obj) -> bool:
        user = self.context['request'].user
        return user in obj.assigned.all() or obj.creator == user


class BoardSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='projects.Board.id', read_only=True)
    board_tasks = TaskSerializer(many=True, required=False)

    class Meta:
        model = Board
        fields = ['id', 'name', 'created_on', 'board_tasks']


class ProjectSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='projects.Project.id', read_only=True)
    creator = ProjectUserSerializer()
    is_part = serializers.SerializerMethodField()

    # project_boards = BoardSerializer(many=True)

    # creator = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = Task
        fields = ['id', 'name', 'creator', 'is_part']
        depth = 1

    def get_is_part(self, obj):
        user = self.context['request'].user
        return user == obj.creator or user in [team.members.all() for team in obj.teams.all()][0]


class TaskCommentSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='projects.TaskComment.id', read_only=True)
    commenter = ProjectUserSerializer()

    class Meta:
        model = TaskComment
        fields = ['id', 'commenter', 'comment', 'timestamp']


class TaskFeedSerializer(serializers.ModelSerializer):
    user = ProjectUserSerializer()

    class Meta:
        model = TaskFeed
        fields = ['id', 'feed', 'user']


class MiniTaskSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='projects.MiniTask.id', read_only=True)

    class Meta:
        model = MiniTask
        fields = ['id', 'name', 'complete', 'created_on', 'updated_on']


class TaskDetailsSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field='projects.Task.id', read_only=True)
    creator = ProjectUserSerializer()
    assigned = ProjectUserSerializer(many=True)
    is_creator = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    mini_tasks = MiniTaskSerializer(many=True)
    task_comments = TaskCommentSerializer(many=True)
    task_feed = TaskFeedSerializer(many=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'is_creator', 'can_edit', 'created_on', 'description', 'creator', 'assigned',
                  'mini_tasks', 'task_comments', 'task_feed']

    def get_can_edit(self, obj) -> bool:
        user = self.context['request'].user
        return user in obj.assigned.all() or obj.creator == user

    def get_is_creator(self, obj) -> bool:
        user = self.context['request'].user
        return obj.creator == user
