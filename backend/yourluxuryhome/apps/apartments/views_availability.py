from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta, date

from rest_framework import status, permissions, viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from .models import Apartment, ApartmentAvailability
from .serializers import (
    ApartmentAvailabilitySerializer,
    ApartmentAvailabilityCreateSerializer,
    ApartmentAvailabilityBulkCreateSerializer
)
from .views import IsAdminOrReadOnly


class ApartmentAvailabilityViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ApartmentAvailability instances."""
    serializer_class = ApartmentAvailabilitySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['apartment', 'date', 'status']
    ordering_fields = ['date', 'created_at']
    ordering = ['date']

    def get_queryset(self):
        """Return all availability entries, or filter by apartment if specified."""
        queryset = ApartmentAvailability.objects.all()
        
        # Filter by apartment if specified
        apartment_id = self.request.query_params.get('apartment_id')
        if apartment_id:
            queryset = queryset.filter(apartment_id=apartment_id)
        
        # Filter by date range if specified
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gte=start_date)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__lte=end_date)
            except ValueError:
                pass
        
        return queryset

    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action == 'create':
            return ApartmentAvailabilityCreateSerializer
        if self.action == 'bulk_create':
            return ApartmentAvailabilityBulkCreateSerializer
        return ApartmentAvailabilitySerializer

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def bulk_create(self, request):
        """Create multiple availability entries for a date range."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            availabilities = serializer.save()
            result_serializer = ApartmentAvailabilitySerializer(
                availabilities, many=True, context={'request': request}
            )
            return Response(result_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def by_apartment(self, request):
        """List all availability entries for a specific apartment."""
        apartment_id = request.query_params.get('apartment_id')
        if not apartment_id:
            return Response(
                {"error": "apartment_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the apartment or return 404
        apartment = get_object_or_404(Apartment, id=apartment_id)
        
        # Get date range parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Default to current month if no dates provided
        if not start_date:
            start_date = date.today()
        else:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            except ValueError:
                start_date = date.today()
        
        if not end_date:
            end_date = start_date + timedelta(days=30)  # Default to 30 days
        else:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            except ValueError:
                end_date = start_date + timedelta(days=30)
        
        # Limit range to 90 days maximum
        if (end_date - start_date).days > 90:
            end_date = start_date + timedelta(days=90)
        
        # Get all availability entries for this apartment in the date range
        availabilities = ApartmentAvailability.objects.filter(
            apartment=apartment,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        # Create a dictionary of date -> availability
        availability_dict = {a.date: a for a in availabilities}
        
        # Create entries for all dates in the range
        result = []
        current_date = start_date
        while current_date <= end_date:
            if current_date in availability_dict:
                # Use existing availability
                availability = availability_dict[current_date]
            else:
                # Create a default availability (not saved to database)
                availability = ApartmentAvailability(
                    apartment=apartment,
                    date=current_date,
                    status='available'  # Default status
                )
            
            serializer = ApartmentAvailabilitySerializer(availability)
            result.append(serializer.data)
            current_date += timedelta(days=1)
        
        return Response(result)

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def update_status(self, request):
        """Update status for a specific apartment and date."""
        apartment_id = request.data.get('apartment_id')
        date_str = request.data.get('date')
        status = request.data.get('status')
        
        if not all([apartment_id, date_str, status]):
            return Response(
                {"error": "apartment_id, date, and status are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the apartment or return 404
        apartment = get_object_or_404(Apartment, id=apartment_id)
        
        # Get or create availability entry
        availability, created = ApartmentAvailability.objects.get_or_create(
            apartment=apartment,
            date=date_obj,
            defaults={'status': status}
        )
        
        if not created:
            availability.status = status
            availability.save()
        
        serializer = ApartmentAvailabilitySerializer(availability)
        return Response(serializer.data)
