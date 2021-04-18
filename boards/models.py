from django.conf import settings
from django.db import models

# Create your models here.
from hashid_field import HashidAutoField

from base.models import BaseModel
from projects.models import Project


class Board(BaseModel):
    """
    Board model inherits fields from BaseField model
    """

    id = HashidAutoField(
        primary_key=True, salt=settings.HASHID_BOARD_SALT, min_length=11
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_boards"
    )