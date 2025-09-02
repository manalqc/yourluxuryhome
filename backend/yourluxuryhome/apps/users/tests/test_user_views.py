from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User

class UserAuthTests(APITestCase):
    def setUp(self):
        self.password = 'StrongPassword123!'
    def test_user_registration_success(self):
        """Ensure a new user can be created successfully."""
        url = reverse('users:register')
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'StrongPassword123!',
            'password2': 'StrongPassword123!',
            'first_name': 'Test',
            'last_name': 'User',
        }
        
        response = self.client.post(url, data, format='json')
        
        # Check that the response is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that the user was created in the database
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get()
        self.assertEqual(user.email, data['email'])
        self.assertEqual(user.first_name, data['first_name'])
        self.assertEqual(user.last_name, data['last_name'])
        self.assertTrue(user.check_password(data['password']))
        
        # Check the response data
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], data['email'])
        self.assertEqual(response.data['user']['first_name'], data['first_name'])
        self.assertEqual(response.data['user']['last_name'], data['last_name'])

    def test_user_login_success(self):
        """Ensure a user can log in successfully and receive tokens."""
        user = User.objects.create_user(
            email='testlogin@example.com',
            username='testloginuser',
            password=self.password,
            first_name='Test',
            last_name='Login'
        )
        url = reverse('users:login')
        data = {
            'email': user.email,
            'password': self.password,
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], user.email)

    def test_get_user_details_authenticated(self):
        """Ensure an authenticated user can retrieve their details."""
        user = User.objects.create_user(
            email='testdetails@example.com',
            username='testdetailsuser',
            password=self.password,
            first_name='Test',
            last_name='Details'
        )

        login_url = reverse('users:login')
        login_data = {
            'email': user.email,
            'password': self.password,
        }
        login_response = self.client.post(login_url, login_data, format='json')
        token = login_response.data['access']

        details_url = reverse('users:user-me')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(details_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], user.email)
        self.assertEqual(response.data['username'], user.username)

    def test_user_logout_success(self):
        """Ensure a user can log out successfully."""
        user = User.objects.create_user(
            email='testlogout@example.com',
            username='testlogoutuser',
            password=self.password
        )

        login_url = reverse('users:login')
        login_data = {'email': user.email, 'password': self.password}
        login_response = self.client.post(login_url, login_data, format='json')
        refresh_token = login_response.data['refresh']
        access_token = login_response.data['access']

        logout_url = reverse('users:jwt-blacklist')
        logout_data = {'refresh': refresh_token}
        response = self.client.post(logout_url, logout_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
