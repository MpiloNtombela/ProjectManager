from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

User = settings.AUTH_USER_MODEL


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    this signal will be fired when user object/instance has been created in order to create user profile object
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, created, **kwargs):
    """
    this signal will be fired when user object/instance has been created, in order to save the created user profile
    """
    if created:
        instance.profile.save()
