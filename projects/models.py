import uuid
from datetime import datetime

from django.core.management.utils import get_random_secret_key
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from dry_rest_permissions.generics import authenticated_users
from hashid_field import HashidAutoField
from hashids import Hashids

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

    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_%(class)ss"
    )
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

    id = HashidAutoField(
        primary_key=True, salt=settings.HASHID_PROJECT_SALT, min_length=11
    )
    teams = models.ManyToManyField(Team, related_name="project_teams", blank=True)
    deadline = models.DateTimeField(blank=True, null=True)
    members = models.ManyToManyField(User, related_name="joined_projects", blank=True)

    def has_user(self, user: User) -> bool:
        """
        has_user - checks whether user is part of the project

        checks if user is the creator of the project or user in project members

        :param user: user obj to be checked
        :type user: User
        :return: boolean
        :rtype: bool
        """
        if user == self.creator:
            return True
        if user.joined_projects.filter(id=self.id).exists():
            return True
        return False
        # for team in self.teams.all():
        #     return team.has_user(user)

    def add_member(self, user: User):
        """
        add_member - add user to project members
        :param user: user obj to be added
        :type user: User
        """
        self.members.add(user)

    def remove_member(self, user: User):
        """
        remove_member - removes user from project members
        :param user: user obj to be removed
        :type user: User
        """
        self.members.remove(user)

    def team_is_valid(self, team: Team) -> bool:
        """
        team_is_valid - checks if team was creator by project creator

        :param team: team obj to be checked
        :type team: Team
        :return: boolean whether the team belongs to project creator
        :rtype: bool
        """
        return self.creator == team.creator

    def add_team(self, team: Team):
        """
        add_team - add a team to project teams
        :param team: team obj to be added
        :type team: Team
        """
        if self.team_is_valid(team):
            self.teams.add(team)

    def remove_team(self, team: Team):
        """
        remove_team - removes a team from project teams
        :param team: team obj to be removed
        :type team: Team
        """
        if team.project_teams.filter(id=self.id).exists():
            self.teams.remove(team)

    def deadline_is_valid(self) -> bool:
        """
        deadline_is_valid - checks if deadline is not past datetime
        :return: boolean
        :rtype: bool
        """
        return self.deadline > datetime.now()

    @staticmethod
    @authenticated_users
    def has_read_permission(request):
        return True

    @authenticated_users
    def has_object_read_permission(self, request) -> bool:
        return request.user == self.creator or self.has_user(request.user)

    @authenticated_users
    def has_object_write_permission(self, request):
        return request.user == self.creator

    @authenticated_users
    def has_object_update_permission(self, request):
        return request.user == self.creator

    def frontend_abs_url(self):
        return f"/project/{self.id}/"


class Invitation(models.Model):
    """
    Invitation - handles project invitations
    """

    id = HashidAutoField(
        primary_key=True, salt=settings.HASHID_PROJECT_SALT, min_length=20
    )
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name="invitation"
    )
    key = models.CharField(unique=True, max_length=30, blank=True, editable=False)
    active = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.project.name

    def gen_key(self) -> str:
        """
        gen_key - generates new invitation key

        :return: new invitation key
        :rtype: str
        """
        _x: int = datetime.now().microsecond
        _salt: str = f"{get_random_secret_key()}{self.project.id}{_x}"
        _hash: Hashids = Hashids(salt=_salt, min_length=22)
        key = str(_hash.encode(_x))
        self.key = key
        self.save()
        return key

    def change_active_status(self):
        self.active = not self.active
        self.save()

    def get_frontend_abs_url(self) -> str:
        """
        get_frontend_abs_url - frontend url for invitation

        [extended_summary]

        :return: invitation url
        :rtype: str
        """
        return f"http://127.0.0.1:8000/doge/{self.key}"


class ProjectFeed(models.Model):
    """
    model for project feed, keeps track of all the actions(i.e changes) happening in the project
    """

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_project_feed"
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_feed"
    )
    feed = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self) -> str:
        return self.project.name


class Board(BaseFields):
    """
    Board model inherits fields from BaseField model
    """

    id = HashidAutoField(
        primary_key=True, salt=settings.HASHID_BOARD_SALT, min_length=11
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_boards"
    )


class Task(BaseFields):
    """
    Task model inherits fields from BaseField model
    """

    id = HashidAutoField(
        primary_key=True, salt=settings.HASHID_TASK_SALT, min_length=11
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_tasks"
    )
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name="board_tasks"
    )
    members = models.ManyToManyField(User, blank=True, related_name="joined_tasks")
    deadline = models.DateTimeField(blank=True, null=True)

    def deadline_is_valid(self) -> bool:
        """
        deadline_is_valid - checks if the task deadline is not greater than project deadline and is not past datetime
        :rtype: bool
        """
        return datetime.now() < self.deadline < self.project.deadline

    def user_is_valid(self, user: User) -> bool:
        """
        user_is_valid - checks if user can be added to task members

        :param user: user object to be checked
        :type user: User
        :return: boolean indication whether user is valid
        :rtype: bool
        """

        if user == self.creator:
            return True
        return self.project.has_user(user)

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


class Subtask(BaseFields):
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
        return user == self.commenter or user == self.task.project.creator


class TaskFeed(models.Model):
    """
    model for task feed, keeps track of all the actions(i.e changes) happening in the task
    """

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_task_feed"
    )
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="task_feed")
    feed = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.task.name
