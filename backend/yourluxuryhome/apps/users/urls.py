from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    UserReservationsView,
    PasswordResetView,
    PasswordResetConfirmView,
    CustomTokenObtainPairView,
    UserViewSet,
)
from apps.reservations.views import UserReservationViewSet

app_name = 'users'

# Create a router for users
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# Create a nested router for user reservations
user_router = routers.NestedSimpleRouter(router, r'users', lookup='user')
user_router.register(r'reservations', UserReservationViewSet, basename='user-reservations')

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/blacklist/', TokenBlacklistView.as_view(), name='jwt-blacklist'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password reset
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Profile endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Reservation history (legacy endpoint)
    path('reservations/', UserReservationsView.as_view(), name='user_reservations'),
    
    # Nested routes for user reservations
    path('', include(user_router.urls)),
    
    # Djoser endpoints for email verification
    path('', include('djoser.urls')),
    path('', include('djoser.urls.jwt')),
]
