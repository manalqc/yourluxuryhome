from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.apartments.models import Apartment, ApartmentCategory
from apps.users.models import User

class ApartmentAPITests(APITestCase):
    def setUp(self):
        """Set up the test client and create initial data."""
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        self.user = User.objects.create_user(
            username='testuser',
            email='user@example.com',
            password='userpassword'
        )

        self.category = ApartmentCategory.objects.create(name='Penthouse')
        self.apartment1 = Apartment.objects.create(
            name='Luxury Penthouse with Ocean View',
            description='A stunning penthouse with panoramic ocean views.',
            address='123 Ocean Drive',
            city='Miami',
            country='USA',
            price_per_night=500.00,
            bedrooms=3,
            bathrooms=3,
            max_guests=6,
            category=self.category
        )
        self.apartment2 = Apartment.objects.create(
            name='Cozy Downtown Loft',
            description='A stylish loft in the heart of the city.',
            address='456 Main Street',
            city='New York',
            country='USA',
            price_per_night=250.00,
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            category=self.category
        )

    def test_list_apartments(self):
        """Ensure we can list all apartments."""
        url = reverse('apartments:apartment-list')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

        # Check that the data is correct
        response_data = response.data['results']
        apartment1_data = next(item for item in response_data if item['id'] == str(self.apartment1.id))
        apartment2_data = next(item for item in response_data if item['id'] == str(self.apartment2.id))

        self.assertEqual(apartment1_data['name'], self.apartment1.name)
        self.assertEqual(float(apartment1_data['price_per_night']), self.apartment1.price_per_night)
        self.assertEqual(apartment2_data['name'], self.apartment2.name)
        self.assertEqual(float(apartment2_data['price_per_night']), self.apartment2.price_per_night)

    def test_retrieve_apartment_detail(self):
        """Ensure we can retrieve a single apartment's details."""
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.apartment1.name)
        self.assertEqual(response.data['description'], self.apartment1.description)
        self.assertEqual(float(response.data['price_per_night']), self.apartment1.price_per_night)
        self.assertEqual(response.data['category']['name'], self.category.name)

    def test_create_apartment_as_admin(self):
        """Ensure an admin user can create a new apartment."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-list')
        data = {
            'name': 'New Beachfront Villa',
            'description': 'A beautiful villa right on the beach.',
            'address': '789 Beach Road',
            'city': 'Malibu',
            'country': 'USA',
            'price_per_night': 1200.00,
            'bedrooms': 5,
            'bathrooms': 5,
            'max_guests': 10,
            'category': self.category.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Apartment.objects.count(), 3)
        self.assertEqual(response.data['name'], data['name'])

    def test_create_apartment_as_non_admin(self):
        """Ensure a non-admin user cannot create a new apartment."""
        self.client.force_authenticate(user=self.user)
        url = reverse('apartments:apartment-list')
        data = {'name': 'Test Apartment', 'price_per_night': 100}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_apartment_unauthenticated(self):
        """Ensure an unauthenticated user cannot create a new apartment."""
        url = reverse('apartments:apartment-list')
        data = {'name': 'Test Apartment', 'price_per_night': 100}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_apartment_as_admin(self):
        """Ensure an admin user can update an apartment."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        data = {
            'name': 'Updated Luxury Penthouse',
            'price_per_night': 600.00,
            'category': self.category.id,
            'description': self.apartment1.description,
            'address': self.apartment1.address,
            'city': self.apartment1.city,
            'country': self.apartment1.country,
            'bedrooms': self.apartment1.bedrooms,
            'bathrooms': self.apartment1.bathrooms,
            'max_guests': self.apartment1.max_guests,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.apartment1.refresh_from_db()
        self.assertEqual(self.apartment1.name, data['name'])
        self.assertEqual(self.apartment1.price_per_night, data['price_per_night'])

    def test_partial_update_apartment_as_admin(self):
        """Ensure an admin user can partially update an apartment."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        data = {'price_per_night': 550.00}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.apartment1.refresh_from_db()
        self.assertEqual(self.apartment1.price_per_night, data['price_per_night'])

    def test_update_apartment_as_non_admin(self):
        """Ensure a non-admin user cannot update an apartment."""
        self.client.force_authenticate(user=self.user)
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        data = {'name': 'New Name'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_apartment_as_admin(self):
        """Ensure an admin user can delete an apartment."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Apartment.objects.count(), 1)

    def test_delete_apartment_as_non_admin(self):
        """Ensure a non-admin user cannot delete an apartment."""
        self.client.force_authenticate(user=self.user)
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_apartment_unauthenticated(self):
        """Ensure an unauthenticated user cannot delete an apartment."""
        url = reverse('apartments:apartment-detail', kwargs={'slug': self.apartment1.slug})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
