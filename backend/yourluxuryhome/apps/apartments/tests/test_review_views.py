from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.apartments.models import Apartment, ApartmentCategory, ApartmentReview
from apps.users.models import User


class ApartmentReviewAPITests(APITestCase):
    def setUp(self):
        """Set up the test client and create initial data."""
        self.admin_user = User.objects.create_superuser(
            username='adminreview',
            email='adminreview@example.com',
            password='adminpassword'
        )
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='user1@example.com',
            password='userpassword'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='user2@example.com',
            password='userpassword'
        )

        category = ApartmentCategory.objects.create(name='Test Category')
        self.apartment = Apartment.objects.create(
            name='Apartment for Reviews',
            description='A place to be reviewed.',
            address='123 Review Lane',
            city='Testville',
            country='Testland',
            price_per_night=100.00,
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            category=category
        )


    def test_create_review_authenticated(self):
        """Ensure an authenticated user can create a review."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-review-list')
        data = {
            'apartment': self.apartment.id,
            'rating': 5,
            'comment': 'Excellent place!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ApartmentReview.objects.count(), 1)
        review = ApartmentReview.objects.first()
        self.assertEqual(review.user, self.user1)
        self.assertEqual(review.rating, 5)

    def test_create_review_unauthenticated(self):
        """Ensure an unauthenticated user cannot create a review."""
        url = reverse('apartments:apartment-review-list')
        data = {'apartment': self.apartment.id, 'rating': 5, 'comment': 'Great!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_review_same_apartment_twice(self):
        """Ensure a user cannot review the same apartment more than once."""
        # First review
        ApartmentReview.objects.create(
            apartment=self.apartment,
            user=self.user1,
            rating=4,
            comment='Good.'
        )

        # Attempt second review
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-review-list')
        data = {
            'apartment': self.apartment.id,
            'rating': 1,
            'comment': 'Trying to review again.'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'][0], 'You have already reviewed this apartment.')

    # --- Review Update/Delete Tests ---

    def test_update_own_review(self):
        """Ensure a user can update their own review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        data = {'rating': 5, 'comment': 'Updated comment.'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        review.refresh_from_db()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Updated comment.')

    def test_partial_update_own_review(self):
        """Ensure a user can partially update their own review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        data = {'comment': 'Just a new comment.'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        review.refresh_from_db()
        self.assertEqual(review.rating, 4)  # Rating should be unchanged
        self.assertEqual(review.comment, 'Just a new comment.')

    def test_update_other_user_review(self):
        """Ensure a user cannot update another user's review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.user2)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        data = {'rating': 1, 'comment': 'Trying to change it.'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_review_as_admin(self):
        """Ensure an admin can update any review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        data = {'rating': 2, 'comment': 'Admin updated.'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        review.refresh_from_db()
        self.assertEqual(review.comment, 'Admin updated.')

    def test_delete_own_review(self):
        """Ensure a user can delete their own review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.user1)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ApartmentReview.objects.count(), 0)

    def test_delete_other_user_review(self):
        """Ensure a user cannot delete another user's review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.user2)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(ApartmentReview.objects.count(), 1)

    def test_delete_review_as_admin(self):
        """Ensure an admin can delete any review."""
        review = ApartmentReview.objects.create(apartment=self.apartment, user=self.user1, rating=4, comment='Initial')
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('apartments:apartment-review-detail', kwargs={'pk': review.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ApartmentReview.objects.count(), 0)

