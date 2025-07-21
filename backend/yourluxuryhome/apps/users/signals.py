from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create a profile when a new user is created.
    
    This ensures every user has an associated profile automatically.
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal handler to save a user's profile when the user is saved.
    
    This ensures profile changes are saved when the user is updated.
    """
    # Check if profile exists to avoid errors during initial migrations
    if hasattr(instance, 'profile'):
        instance.profile.save()
