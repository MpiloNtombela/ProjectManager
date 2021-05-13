from hashid_field.rest import HashidSerializerCharField
from rest_framework import serializers

from boards.models import Board


class BSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="boards.Board.id", read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name"]


class BoardSerializer(serializers.ModelSerializer):
    id = HashidSerializerCharField(source_field="boards.Board.id", read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "created_on"]