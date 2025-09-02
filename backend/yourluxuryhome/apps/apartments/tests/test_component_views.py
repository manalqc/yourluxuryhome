from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.apartments.models import ApartmentCategory, ApartmentAmenity
from apps.users.models import User


class ApartmentComponentAPITests(APITestCase):
    def setUp(self):
        """Set up the test client and create initial data."""
        self.admin_user = User.objects.create_superuser(
            username='admincomponent',
            email='admincomponent@example.com',
            password='adminpassword'
        )
        self.user = User.objects.create_user(
            username='testcomponentuser',
            email='usercomponent@example.com',
            password='userpassword'
        )

        self.category1 = ApartmentCategory.objects.create(name='Villa')
        self.category2 = ApartmentCategory.objects.create(name='Studio')

        self.amenity1 = ApartmentAmenity.objects.create(name='Swimming Pool')
        self.amenity2 = ApartmentAmenity.objects.create(name='WiFi')

    def test_list_categories(self):
        """Ensure any user can list apartment categories."""
        url = reverse('apartments:apartment-category-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_list_amenities(self):
        """Ensure any user can list apartment amenities."""
        url = reverse('apartments:apartment-amenity-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    # --- Category Write Tests ---

    def test_create_category_as_admin(self):
        """Ensure an admin user can create a new category."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-category-list')
        data = {'name': 'Loft'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ApartmentCategory.objects.count(), 3)
        self.assertEqual(response.data['name'], 'Loft')

    def test_create_category_as_non_admin(self):
        """Ensure a non-admin user cannot create a category."""
        self.client.force_authenticate(user=self.user)
        url = reverse('apartments:apartment-category-list')
        data = {'name': 'Loft'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_category_unauthenticated(self):
        """Ensure an unauthenticated user cannot create a category."""
        url = reverse('apartments:apartment-category-list')
        data = {'name': 'Loft'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_category_as_admin(self):
        """Ensure an admin user can update a category."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-category-detail', kwargs={'pk': self.category1.pk})
        data = {'name': 'Luxury Villa'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.category1.refresh_from_db()
        self.assertEqual(self.category1.name, 'Luxury Villa')

    def test_delete_category_as_admin(self):
        """Ensure an admin user can delete a category."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-category-detail', kwargs={'pk': self.category1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ApartmentCategory.objects.count(), 1)

    # --- Amenity Write Tests ---

    def test_create_amenity_as_admin(self):
        """Ensure an admin user can create a new amenity."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-amenity-list')
        data = {'name': 'Gym'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ApartmentAmenity.objects.count(), 3)
        self.assertEqual(response.data['name'], 'Gym')

    def test_create_amenity_as_non_admin(self):
        """Ensure a non-admin user cannot create an amenity."""
        self.client.force_authenticate(user=self.user)
        url = reverse('apartments:apartment-amenity-list')
        data = {'name': 'Gym'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_amenity_as_admin(self):
        """Ensure an admin user can update an amenity."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-amenity-detail', kwargs={'pk': self.amenity1.pk})
        data = {'name': 'Private Pool'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.amenity1.refresh_from_db()
        self.assertEqual(self.amenity1.name, 'Private Pool')

    def test_delete_amenity_as_admin(self):
        """Ensure an admin user can delete an amenity."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-amenity-detail', kwargs={'pk': self.amenity1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ApartmentAmenity.objects.count(), 1)

