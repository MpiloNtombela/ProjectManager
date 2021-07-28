from datetime import datetime

from django.conf import settings
from django.db import models
from django.utils import timezone
from dry_rest_permissions.generics import authenticated_users

from hashid_field import HashidAutoField

from base.models import BaseModel
from boards.models import Board
from projects.models import User


class Task(BaseModel):
    """
    Task model inherits fields from BaseField model
    """

    id = HashidAutoField(
        primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=11
    )
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name="board_tasks"
    )
    members = models.ManyToManyField(User, blank=True, related_name="joined_tasks")
    deadline = models.DateTimeField(blank=True, null=True)
    moved_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["moved_at"]

    def deadline_is_valid(self) -> bool:
        """
        deadline_is_valid - checks if the task deadline is not greater than project deadline and is not past datetime
        :rtype: bool
        """
        return datetime.now() < self.deadline < self.project.deadline

    def user_is_valid(self, user: User) -> bool:
        """
        user_is_valid - checks if user can be added to task members
        ;rtype: bool
        """

        if user == self.creator:
            return True
        return self.board.project.has_user(user)

    def add_user(self, user: User):
        """
        add_user - adds user to task members

        :param user: user obj to be added
        :type user: User
        """
        self.members.add(user)

    def remove_user(self, user: User):
        """
        remove_user - removes user to task members

        :param user: user obj to be removed
        :type user: User
        """
        if self.user_part_of_task(user):
            self.members.remove(user)

    def user_part_of_task(self, user: User) -> bool:
        """
        user_part_of_task - checks if given user is part of the task

        :param user: user obj to be checked
        :type user: User
        :rtype: bool
        """
        return user == self.creator or user.joined_tasks.filter(id=self.id).exists()

    def move(self, destination: Board) -> object:
        """
        move - moves the task to new board

        :param destination: the board that the task is being moved to
        :type destination: Board
        :return: task object
        :rtype: object
        """
        self.board = destination
        self.moved_at = timezone.now()
        self.save()

    @staticmethod
    @authenticated_users
    def has_read_permission(request):
        return True

    @authenticated_users
    def has_object_read_permission(self, request) -> bool:
        return self.board.project.has_user(request.user)

    @authenticated_users
    def has_object_write_permission(self, request):
        return self.user_part_of_task(request.user)

    @authenticated_users
    def has_object_update_permission(self, request):
        return self.user_part_of_task(request.user)


class Subtask(BaseModel):
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=7)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks")
    complete = models.BooleanField(default=False)


class TaskComment(models.Model):
    """
    model for task comments
    """

    id = HashidAutoField(primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=7)
    commenter = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="commenter"
    )
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name="task_comments"
    )
    comment = models.CharField(max_length=750)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.task.name

    def can_be_deleted_by(self, user):
        return user == self.commenter or user == self.task.board.project.creator


class TaskLog(models.Model):
    """
    model for task log, keeps track of all the actions(i.e changes) happening in the task
    """

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_task_log"
    )
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="task_logs")
    log = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.task.name
