from datetime import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from hashid_field import HashidAutoField

from users.models import Team

User = get_user_model()


class BaseFields(models.Model):
    """
    Abstract class shared by other models with common fields:
    -name
    -description
    -created_on (timestamp)
    -updated_on
    """
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="%(class)s_creator")
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_on = models.DateTimeField(auto_now=True, auto_now_add=False)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Project(BaseFields):
    """
    Project model inherits fields from BaseField model
    """
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_PROJECT_SALT, min_length=11)
    teams = models.ManyToManyField(Team, related_name='project_teams', blank=True)
    deadline = models.DateTimeField(blank=True, null=True)

    def has_this_user(self, user: object) -> bool:
        """
        checks if user has permission to view project
        :param user:
        :return bool:
        """
        if user == self.creator:
            return True
        for team in self.teams.all():
            return user in team.members.all()

    def team_is_valid(self, team: Team) -> bool:
        """checks if the team that is about to be added to project was created by project creator
        :type team: object
        :param team: team being checked
        :return: bool
        """
        return team.creator == self.creator

    def add_team(self, team: Team):
        """
        adds team to project teams
        :type team: object
        :param team: team to add
        """
        if self.creator == team.creator:
            self.teams.add(team)

    def remove_team(self, team: Team):
        """
        removes a team to project teams
        :type team: object
        :param team: team to remove
        """
        if self.creator == team.creator:
            if team in self.teams.all():
                self.teams.remove(team)

    def deadline_is_valid(self) -> bool:
        """
        checks if the deadline is not a past datetime
        :return: bool
        """
        return self.deadline > datetime.now()


class ProjectFeed(models.Model):
    """
    model for project feed, keeps track of all the actions(i.e changes) happening in the project
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_project_feed')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_feed')
    feed = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self) -> str:
        return self.project.name


class Board(BaseFields):
    """
    Board model inherits fields from BaseField model
    """
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_BOARD_SALT, min_length=11)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_boards')


class Task(BaseFields):
    """
    Task model inherits fields from BaseField model
    """
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=11)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_tasks')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='board_tasks')
    members = models.ManyToManyField(User, blank=True, related_name='task_members')
    deadline = models.DateTimeField(blank=True, null=True)

    def deadline_is_valid(self) -> bool:
        """
        checks if the task deadline is not greater than project deadline and is not past datetime
        :return: bool
        """
        return datetime.now() < self.deadline < self.project.deadline

    def user_part_of_task(self, user: User):
        """
        checks if given user is part of the task
        :type user: object
        :param user: that wanna check
        :return: bool
        """
        return user == self.creator or user in self.members


class Subtask(BaseFields):
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=7)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    complete = models.BooleanField(default=False)


class TaskComment(models.Model):
    """
    model for task comments
    """
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=7)
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenter')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_comments')
    comment = models.CharField(max_length=750)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.commenter


class TaskFeed(models.Model):
    """
    model for task feed, keeps track of all the actions(i.e changes) happening in the task
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_task_feed')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_feed')
    feed = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.task.name
