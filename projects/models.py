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
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_%(class)ss")
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
    members = models.ManyToManyField(User, related_name='joined_projects', blank=True)

    def has_user(self, user: User) -> bool:
        """
        checks if user part of the project
        :param user: User
        :return: bool
        """
        if user == self.creator:
            return True
        if user.joined_projects.filter(id=self.id).exists():
            return True
        return False
        # for team in self.teams.all():
        #     return team.has_user(user)

    def add_user(self, user: User):
        """
        adds user project members
        :param user: User
        """
        self.members.add(user)

    def remove_user(self, user: User):
        """
        removes user project members
        :param user: User
        """
        self.members.remove(user)

    def team_is_valid(self, team: Team) -> bool:
        """checks if the team creator is the project creator
        :param team: Team object
        :return: bool
        """
        return self.creator == team.creator

    def add_team(self, team: Team):
        """
        adds team to project teams
        :param team: Team to be add
        """
        if self.team_is_valid(team):
            self.teams.add(team)

    def remove_team(self, team: Team):
        """
        removes a team to project teams
        :param team: team to remove
        """
        if team.project_teams.filter(id=self.id).exists():
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
    members = models.ManyToManyField(User, blank=True, related_name='joined_tasks')
    deadline = models.DateTimeField(blank=True, null=True)

    def deadline_is_valid(self) -> bool:
        """
        checks if the task deadline is not greater than project deadline and is not past datetime
        :return: bool
        """
        return datetime.now() < self.deadline < self.project.deadline

    def user_is_valid(self, user: User) -> bool:
        """
        checks if user can be added to task members
        :param user: User object
        :return: bool
        """
        if user == self.creator:
            return True
        return self.project.has_user(user)

    def add_user(self, user: User):
        """
        adds user to tasks members
        :param user: User
        """
        self.members.add(user)

    def remove_user(self, user: User):
        """
        removes user tasks members
        :param user: User
        """
        if self.user_part_of_task(user):
            self.members.remove(user)

    def user_part_of_task(self, user: User):
        """
        checks if given user is part of the task
        :param user: User
        :return: bool
        """
        return user == self.creator or user.joined_tasks.filter(id=self.id).exists()


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
        return self.task.name

    def can_be_deleted_by(self, user):
        return user == self.commenter or user == self.task.project.creator


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
