from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.apartments.models import Apartment, ApartmentCategory, ApartmentImage
from apps.users.models import User


class ApartmentImageAPITests(APITestCase):
    def setUp(self):
        """Set up the test client and create initial data."""
        self.admin_user = User.objects.create_superuser(
            username='adminimage',
            email='adminimage@example.com',
            password='adminpassword'
        )
        self.user1 = User.objects.create_user(
            username='testuserimage',
            email='userimage@example.com',
            password='userpassword'
        )

        category = ApartmentCategory.objects.create(name='Category for Image Tests')
        self.apartment = Apartment.objects.create(
            name='Apartment for Image Tests',
            description='An apartment with images.',
            address='123 Image Street',
            city='Imagetown',
            country='Imageland',
            price_per_night=150.00,
            bedrooms=2,
            bathrooms=1,
            max_guests=4,
            category=category
        )

        # Create a dummy image file
        self.image_file = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b',
            content_type='image/jpeg'
        )

        self.image = ApartmentImage.objects.create(
            apartment=self.apartment,
            image=self.image_file,
            caption='A test image.'
        )

    def test_list_images(self):
        """Ensure any user can list apartment images."""
        url = reverse('apartments:apartment-image-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_retrieve_image(self):
        """Ensure any user can retrieve a single apartment image."""
        url = reverse('apartments:apartment-image-detail', kwargs={'pk': self.image.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['caption'], self.image.caption)

    def test_create_image_as_admin(self):
        """Ensure an admin user can create an apartment image."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-image-list')
        image_data = SimpleUploadedFile(
            name='new_image.gif',
            content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b',
            content_type='image/gif'
        )
        data = {
            'apartment': self.apartment.id,
            'image': image_data,
            'caption': 'A new image created by admin.'
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ApartmentImage.objects.count(), 2)

    def test_create_image_as_non_admin(self):
        """Ensure a non-admin user cannot create an apartment image."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-image-list')
        image_data = SimpleUploadedFile(
            name='fail.gif',
            content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b',
            content_type='image/gif'
        )
        data = {'apartment': self.apartment.id, 'image': image_data}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_image_unauthenticated(self):
        """Ensure an unauthenticated user cannot create an apartment image."""
        url = reverse('apartments:apartment-image-list')
        image_data = SimpleUploadedFile(
            name='fail.gif',
            content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b',
            content_type='image/gif'
        )
        data = {'apartment': self.apartment.id, 'image': image_data}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_image_as_admin(self):
        """Ensure an admin user can update an apartment image."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-image-detail', kwargs={'pk': self.image.pk})
        data = {'caption': 'Updated caption by admin.'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.image.refresh_from_db()
        self.assertEqual(self.image.caption, 'Updated caption by admin.')

    def test_update_image_as_non_admin(self):
        """Ensure a non-admin user cannot update an apartment image."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-image-detail', kwargs={'pk': self.image.pk})
        data = {'caption': 'Trying to update.'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_image_as_admin(self):
        """Ensure an admin user can delete an apartment image."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-image-detail', kwargs={'pk': self.image.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ApartmentImage.objects.count(), 0)

    def test_delete_image_as_non_admin(self):
        """Ensure a non-admin user cannot delete an apartment image."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-image-detail', kwargs={'pk': self.image.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(ApartmentImage.objects.count(), 1)

