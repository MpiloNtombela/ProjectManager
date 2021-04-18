from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from projects.models import Invitation, Project

@receiver(post_save, sender=Project)
def create_project_invitation(sender, instance, created, **kwargs):
    if created:
        Invitation.objects.create(project=instance)



@receiver(post_save, sender=Project)
def save_project_invitation(sender, instance, created, **kwargs):
    if created:
        print(f'-------------------{instance.members.all()}---------')
        instance.invitation.save()
        instance.invitation.gen_key()
        instance.add_member(instance.creator)
