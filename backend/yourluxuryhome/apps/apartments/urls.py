from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ApartmentViewSet,
    ApartmentCategoryViewSet,
    ApartmentAmenityViewSet,
    ApartmentImageViewSet,
    ApartmentReviewViewSet
)

router = DefaultRouter()
router.register(r'categories', ApartmentCategoryViewSet, basename='apartment-category')
router.register(r'amenities', ApartmentAmenityViewSet, basename='apartment-amenity')
router.register(r'apartments', ApartmentViewSet, basename='apartment')
router.register(r'images', ApartmentImageViewSet, basename='apartment-image')
router.register(r'reviews', ApartmentReviewViewSet, basename='apartment-review')

urlpatterns = [
    path('', include(router.urls)),
]
