from django.shortcuts import render, get_object_or_404
from django.db.models import Q, Count, Avg
from django.utils import timezone

from rest_framework import status, permissions, generics, viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from .models import Apartment, ApartmentCategory, ApartmentAmenity, ApartmentImage, ApartmentReview, VirtualTourRoom
from .serializers import (
    ApartmentListSerializer,
    ApartmentDetailSerializer,
    ApartmentCreateUpdateSerializer,
    ApartmentCategorySerializer,
    ApartmentAmenitySerializer,
    ApartmentImageSerializer,
    ApartmentImageCreateSerializer,
    ApartmentReviewSerializer,
    ApartmentReviewCreateSerializer,
    ApartmentReviewUpdateSerializer,
    VirtualTourSerializer,
    VirtualTourRoomSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow admin users to edit objects."""
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff


class ApartmentCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ApartmentCategory instances."""
    queryset = ApartmentCategory.objects.all()
    serializer_class = ApartmentCategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ApartmentAmenityViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ApartmentAmenity instances."""
    queryset = ApartmentAmenity.objects.all()
    serializer_class = ApartmentAmenitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Apartment instances."""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'country', 'bedrooms', 'bathrooms', 'max_guests', 'category', 'is_available']
    search_fields = ['name', 'description', 'address', 'city', 'country']
    ordering_fields = ['price_per_night', 'created_at', 'bedrooms', 'bathrooms', 'max_guests']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Apartment.objects.all()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_night__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_night__lte=max_price)
        
        # Filter by amenities
        amenities = self.request.query_params.getlist('amenities')
        if amenities:
            for amenity_id in amenities:
                queryset = queryset.filter(amenities__id=amenity_id)
        
        # Filter by availability for specific dates
        check_in_date = self.request.query_params.get('check_in_date')
        check_out_date = self.request.query_params.get('check_out_date')
        if check_in_date and check_out_date:
            # Exclude apartments that have overlapping reservations
            from apps.reservations.models import Reservation, ReservationStatus
            
            unavailable_apartments = Reservation.objects.filter(
                status__in=[ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
                check_in_date__lt=check_out_date,
                check_out_date__gt=check_in_date
            ).values_list('apartment_id', flat=True)
            
            queryset = queryset.exclude(id__in=unavailable_apartments)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApartmentListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ApartmentCreateUpdateSerializer
        return ApartmentDetailSerializer
    
    @action(detail=True, methods=['get'])
    def availability(self, request, slug=None):
        """Check apartment availability for specific dates."""
        apartment = self.get_object()
        
        check_in_date = request.query_params.get('check_in_date')
        check_out_date = request.query_params.get('check_out_date')
        
        if not check_in_date or not check_out_date:
            return Response(
                {"error": "Both check_in_date and check_out_date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_booked = apartment.is_booked(check_in_date, check_out_date)
        
        return Response({
            "is_available": not is_booked and apartment.is_available,
            "check_in_date": check_in_date,
            "check_out_date": check_out_date
        })
    
    @action(detail=True, methods=['get'])
    def reservations(self, request, slug=None):
        """List all reservations for this apartment (admin only)."""
        if not request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        apartment = self.get_object()
        
        from apps.reservations.models import Reservation
        from apps.reservations.serializers import ReservationSerializer
        
        reservations = Reservation.objects.filter(apartment=apartment)
        serializer = ReservationSerializer(reservations, many=True)
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def virtual_tour(self, request, slug=None):
        """Get virtual tour data for this apartment including all 360° rooms and connections."""
        apartment = self.get_object()
        
        # Get all virtual tour rooms for this apartment
        rooms = VirtualTourRoom.objects.filter(apartment=apartment).order_by('order', 'created_at')
        
        if not rooms.exists():
            return Response(
                {"detail": "No virtual tour available for this apartment."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get the starting room (default to first room if none is marked as starting)
        starting_room = rooms.filter(is_starting_room=True).first()
        if not starting_room:
            starting_room = rooms.first()
        
        # Create a simple object to hold the data for VirtualTourSerializer
        class TourData:
            def __init__(self, apartment_id, apartment_name, rooms, starting_room, room_count):
                self.apartment_id = apartment_id
                self.apartment_name = apartment_name
                self.rooms = rooms
                self.starting_room = starting_room
                self.room_count = room_count

        # Prepare the response data
        tour_data = TourData(
            apartment_id=apartment.id,
            apartment_name=apartment.name,
            rooms=rooms,
            starting_room=starting_room,
            room_count=rooms.count()
        )
        
        serializer = VirtualTourSerializer(tour_data, context={'request': request})
        return Response(serializer.data)


class ApartmentImageViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ApartmentImage instances."""
    serializer_class = ApartmentImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ApartmentImage.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ApartmentImageCreateSerializer
        return ApartmentImageSerializer
    
    @action(detail=False, methods=['get'])
    def by_apartment(self, request):
        """List all images for a specific apartment."""
        apartment_id = request.query_params.get('apartment_id')
        if not apartment_id:
            return Response(
                {"error": "apartment_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        images = ApartmentImage.objects.filter(apartment_id=apartment_id)
        serializer = self.get_serializer(images, many=True)
        
        return Response(serializer.data)


class ApartmentReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ApartmentReview instances."""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['apartment', 'rating']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return ApartmentReview.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ApartmentReviewCreateSerializer
        if self.action in ['update', 'partial_update']:
            return ApartmentReviewUpdateSerializer
        return ApartmentReviewSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        review = self.get_object()
        # Only allow users to update their own reviews
        if review.user != request.user and not request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to update this review."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        review = self.get_object()
        # Only allow users to delete their own reviews or admin users
        if review.user != request.user and not request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to delete this review."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def by_apartment(self, request):
        """List all reviews for a specific apartment."""
        apartment_id = request.query_params.get('apartment_id')
        if not apartment_id:
            return Response(
                {"error": "apartment_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = ApartmentReview.objects.filter(apartment_id=apartment_id)
        serializer = self.get_serializer(reviews, many=True)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """List all reviews by the current user."""
        reviews = ApartmentReview.objects.filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        
        return Response(serializer.data)
