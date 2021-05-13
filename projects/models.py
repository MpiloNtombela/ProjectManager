import uuid
from datetime import datetime

from django.core.management.utils import get_random_secret_key
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from dry_rest_permissions.generics import authenticated_users
from hashid_field import HashidAutoField
from hashids import Hashids

from base.models import BaseModel
from users.models import Team

User = get_user_model()


class Project(BaseModel):
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
        self.save()

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


class ProjectLog(models.Model):
    """
    model for project log, keeps track of all the actions(i.e changes) happening in the project
    """

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_project_log"
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_log"
    )
    log = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self) -> str:
        return self.project.name


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
    key = models.UUIDField(blank=True, null=True, editable=False)
    passcode = models.CharField(max_length=10, blank=True, editable=False)
    anyone = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.project.name

    def gen_passcode(self) -> str:
        """
        gen_passcode generates a new passcode for the invitation
        :rtype: str
        """
        _x: int = datetime.now().microsecond
        _salt: str = f"{get_random_secret_key()}{self.project.id}{_x}"
        _hash: Hashids = Hashids(salt=_salt, min_length=7)
        passcode = str(_hash.encode(_x))
        return passcode

    def gen_key(self) -> str:
        """
        gen_key - generates new invitation key

        :return: new invitation key
        :rtype: str
        """
        key =  uuid.uuid4()
        self.key = key
        passcode = self.gen_passcode()
        self.passcode = passcode
        self.save()
        return {key:key, passcode:passcode}

    def change_active_status(self):
        self.active = not self.active
        self.save()

    def get_frontend_abs_url(self) -> str:
        """
        get_frontend_abs_url - frontend url for invitation

        :return: invitation url
        :rtype: str
        """
        return f"http://127.0.0.1:8000/projects/invite?action=join&kit={self.project.id}&key={self.key}" if self.key else None
