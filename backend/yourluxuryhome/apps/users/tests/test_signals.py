from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import Profile

User = get_user_model()


class UserProfileSignalTests(TestCase):
    """Test suite for user profile signals."""
    
    def test_profile_created_on_user_creation(self):
        """Test that a profile is automatically created when a user is created."""
        # Create a new user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        
        # Check that a profile was created for the user
        self.assertTrue(hasattr(user, 'profile'))
        self.assertIsInstance(user.profile, Profile)
        
        # Check that the profile is linked to the correct user
        self.assertEqual(user.profile.user, user)
        
        # Check that the profile fields are initialized correctly
        self.assertIsNone(user.profile.bio)
        self.assertIsNone(user.profile.phone_number)
        self.assertIsNone(user.profile.photo)
        
    def test_profile_updated_on_user_update(self):
        """Test that a profile is updated when a user is updated."""
        # Create a new user with a profile
        user = User.objects.create_user(
            username='updateuser',
            email='update@example.com',
            password='updatepassword123',
            first_name='Update',
            last_name='User'
        )
        
        # Update the profile
        user.profile.bio = 'This is a test bio'
        user.profile.phone_number = '+1234567890'
        user.save()
        
        # Refresh the user from the database
        user.refresh_from_db()
        
        # Check that the profile was updated
        self.assertEqual(user.profile.bio, 'This is a test bio')
        self.assertEqual(user.profile.phone_number, '+1234567890')
