from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from boards.models import Board
from projects.models import Invitation, Project
from tasks.models import Task


@receiver(post_save, sender=Project)
def initial_project_setup(sender, instance, created, **kwargs):
    if created:
        Invitation.objects.create(project=instance)
        instance.invitation.save()
        Board.objects.bulk_create(
            [
                Board(name=_("To Do"), project=instance, creator=instance.creator),
                Board(
                    name=_("In Progress"), project=instance, creator=instance.creator
                ),
                Board(name=_("Completed"), project=instance, creator=instance.creator),
            ]
        )
        task = Task.objects.create(
            creator=instance.creator,
            board=Board.objects.filter(project=instance).first(),
            name=_("A cool first task. Click to open TaskView"),
            description=_(
                "TaskView shows the progress of the task and everything related to it"
            ),
        )
        task.save()


@receiver(post_save, sender=Invitation)
def add_creator_to_members(sender, instance, created, **kwargs):
    if created:
        project = instance.project
        project.add_member(project.creator)