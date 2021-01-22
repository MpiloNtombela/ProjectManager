from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from hashid_field import HashidAutoField

from users.models import Team

User = get_user_model()


class BaseFields(models.Model):
    """
    Abstract class shared by other models with common fields:
    -creator
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
    deadline = models.DateTimeField()

    def has_this_user(self, user: object) -> bool:
        """
        checks if user has permission to view project
        :param user:
        :return bool:
        """
        if user == self.creator:
            return True
        for team in self.teams.all():
            if user in team.members.all():
                return True
        return False

    def add_team(self, team):
        """
        adds team to project teams
        :param team
        """
        if self.creator == team.creator:
            if team not in self.teams.all():
                self.teams.add(team)

    def remove_team(self, team):
        """
        removes team to project teams
        :param team
        """
        if self.creator == team.creator:
            if team in self.teams.all():
                self.teams.remove(team)


class Board(BaseFields):
    """
    Board model inherits fields from BaseField model
    """
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_BOARD_SALT, min_length=11)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='board_project')


class Task(BaseFields):
    """
    Task model inherits fields from BaseField model
    """
    id = HashidAutoField(primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=11)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='task_project')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='task_board')
    assign = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_to")
    deadline = models.DateTimeField(blank=True, null=True)

    def deadline_is_valid(self) -> bool:
        return self.deadline < self.project.deadline
