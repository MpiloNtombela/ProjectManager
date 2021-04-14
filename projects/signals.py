from django.db.models.signals import post_save
from django.dispatch import receiver

from projects.models import Invitation, Project


@receiver(post_save, sender=Project)
def create_project_invitation(sender, instance, created, **kwargs):
    if created:
        Invitation.objects.create(user=instance)


@receiver(post_save, sender=Project)
def save_project_invitation(sender, instance, created, **kwargs):
    if created:
        instance.invitation.save()
