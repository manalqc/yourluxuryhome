from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import ReservationViewSet, ReservationServiceViewSet

app_name = 'reservations'

# Create a router for reservations
router = DefaultRouter()
router.register(r'', ReservationViewSet, basename='reservation')

# Create a nested router for reservation services
reservation_router = routers.NestedDefaultRouter(router, r'', lookup='reservation')
reservation_router.register(r'services', ReservationServiceViewSet, basename='reservation-services')

urlpatterns = [
    # Main reservation endpoints
    path('', include(router.urls)),
    
    # Nested reservation service endpoints
    path('', include(reservation_router.urls)),
]