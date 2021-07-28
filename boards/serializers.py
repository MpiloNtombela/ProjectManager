from base.mixins import NestedSerializerDynamicLoadMixin
from django.db.models.query import prefetch_related_objects
from tasks.serializers import TaskSerializer
from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from boards.models import Board


class BSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="boards.Board.id", read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name"]


class BoardSerializer(serializers.ModelSerializer, NestedSerializerDynamicLoadMixin):
    id = HashidSerializerCharField(source_field="boards.Board.id", read_only=True)
    board_tasks = TaskSerializer(required=False, many=True)
    PREFETCH_RELATED_FIELDS = ["board_tasks__members", "board_tasks__creator"]

    class Meta:
        model = Board
        fields = ["id", "name", "created_on", "board_tasks"]

    @classmethod
    def dynamic_load(cls, queryset):
        queryset = queryset.prefetch_related(
            "board_tasks__members", "board_tasks__creator"
        )
        return queryset