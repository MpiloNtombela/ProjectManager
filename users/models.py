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

    avatar = models.FileField(null=True, blank=True, upload_to='avatars/')

    def __str__(self):
        """:returns username of the user when ever the user model is called or used"""
        return self.username


class Team(models.Model):
    id = HashidAutoField(primary_key=True, min_length=20, salt=settings.HASHID_USER_SALT)
    team_name = models.CharField(max_length=100)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_teams")
    members = models.ManyToManyField(User, related_name="joined_teams", blank=True)
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

    def add_user(self, user: User):
        """
        add new user to the team
        :param user: User
        """
        self.members.add(user)

    def remove_user(self, user: User):
        """
        remove user from the team
        :param user: User
        """
        self.members.remove(user)

    def has_user(self, user: User) -> bool:
        """
        checks a user in the team members list
        :param user: User
        :return: bool
        """
        return user.joined_teams.filter(id=self.id).exists()

    def __str__(self):
        """:returns: team name"""
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

    def add_team(self, team: Team):
        """
        add team to user profile
        :param team: Team
        """
        self.teams.add(team)

    def remove_team(self, team: Team):
        """
        removes team from profile
        :param team: Team
        """
        self.teams.remove(team)

    def block_user(self, user: User):
        """
        add user to blocked list
        :param user: User
        """
        self.blocked_users.add(user)

    def unblock_user(self, user: User):
        """
        removes user from blocked list
        :param user: User
        """
        self.blocked_users.remove(user)

    def __str__(self):
        return self.user.username
