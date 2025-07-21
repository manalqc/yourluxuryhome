from django.conf import settings
from djoser import email
from djoser.conf import settings as djoser_settings


class ActivationEmail(email.ActivationEmail):
    """Custom activation email for user registration."""
    template_name = 'email/activation.html'


class ConfirmationEmail(email.ConfirmationEmail):
    """Custom confirmation email after successful activation."""
    template_name = 'email/confirmation.html'


class PasswordResetEmail(email.PasswordResetEmail):
    """Custom password reset email."""
    template_name = 'email/password_reset.html'
