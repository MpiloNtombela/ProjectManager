from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
from hashid_field import HashidAutoField


class User(AbstractUser):
    """
    Base user model, which extends from default django **AbstractUser**
    """
    id = HashidAutoField(primary_key=True, min_length=15, alphabet='0123456789abcdefghijklmnopqrstuvwxyz',
                         salt=settings.HASHID_USER_SALT)

    def __str__(self):
        """:returns username of the user when ever the user model is called or used"""
        return self.username


class Team(models.Model):
    id = HashidAutoField(primary_key=True, min_length=20, salt=settings.HASHID_USER_SALT)
    team_name = models.CharField(max_length=100)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="team_leader")
    members = models.ManyToManyField(User, related_name="team_members")
    created_on = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_on = models.DateTimeField(auto_now_add=False, auto_now=True)

    class Meta:
        """
        creates a constrain to ensure that there is only one team with same **creator and team_name**
        :returns *HTTP_500* err if violated
        """
        constraints = [
            models.UniqueConstraint(fields=['creator', 'team_name'], name="unique_team_name")
        ]

    def add_member(self, member: object):
        """add new member to the team
        :param member"""
        self.members.add(member)

    def remove_member(self, member: object):
        """remove member from the team
        :param member"""
        self.members.remove(member)

    def has_this_member(self, member: object) -> bool:
        """checks if to_user not already part of a team"""
        return True if member in self.members.all() else False

    def __str__(self):
        """:returns team name"""
        return self.team_name


class Profile(models.Model):
    """
    user profile which has a *oneToOne* relationship with user object/instance/model
    """
    id = HashidAutoField(primary_key=True, min_length=15, salt=settings.HASHID_USER_SALT)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(verbose_name="About Me", max_length=1000, blank=True)
    teams = models.ManyToManyField(Team, blank=True, related_name="user_teams")
    blocked_users = models.ManyToManyField(User, blank=True, related_name='blocked_users')

    def add_team(self, team: object):
        """add team to user profile
        :param team"""
        self.teams.add(team)

    def remove_team(self, team: object):
        """removes team from profile
        :param team"""
        self.teams.remove(team)

    def add_blocked_users(self, user: object):
        """add user to blocked list
        :param user"""
        self.blocked_users.add(user)

    def unblock(self, user: object):
        """removes user from blocked list
        :param user"""
        self.blocked_users.remove(user)

    def __str__(self):
        return self.user.username
