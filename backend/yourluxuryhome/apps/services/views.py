from django.shortcuts import render, get_object_or_404
from django.db.models import Count, Q

from rest_framework import status, permissions, viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from .models import ServiceType, Service
from .serializers import (
    ServiceTypeSerializer,
    ServiceListSerializer,
    ServiceDetailSerializer,
    ServiceCreateUpdateSerializer,
    ServiceTypeWithServicesSerializer,
    ServiceForReservationSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow admin users to edit objects."""
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff


class ServiceTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ServiceType instances."""
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name']
    ordering = ['order', 'name']
    
    def get_serializer_class(self):
        if self.action == 'with_services':
            return ServiceTypeWithServicesSerializer
        return ServiceTypeSerializer
    
    @action(detail=False, methods=['get'])
    def with_services(self, request):
        """List all service types with their associated services."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def services(self, request, pk=None):
        """List all services for a specific service type."""
        service_type = self.get_object()
        services = service_type.services.filter(is_active=True)
        serializer = ServiceListSerializer(services, many=True)
        return Response(serializer.data)


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Service instances."""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'is_active', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['type__order', 'name', 'price']
    ordering = ['type__order', 'name']
    
    def get_queryset(self):
        queryset = Service.objects.all()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by free services
        is_free = self.request.query_params.get('is_free')
        if is_free is not None:
            is_free = is_free.lower() == 'true'
            if is_free:
                queryset = queryset.filter(price=0)
            else:
                queryset = queryset.filter(price__gt=0)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ServiceListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ServiceCreateUpdateSerializer
        elif self.action == 'for_reservation':
            return ServiceForReservationSerializer
        return ServiceDetailSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """List all featured services."""
        services = self.get_queryset().filter(is_featured=True, is_active=True)
        serializer = ServiceListSerializer(services, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Group services by their types."""
        types = ServiceType.objects.all()
        serializer = ServiceTypeWithServicesSerializer(types, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def for_reservation(self, request):
        """List all active services for reservation form."""
        services = self.get_queryset().filter(is_active=True)
        serializer = ServiceForReservationSerializer(services, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def included_with_apartment(self, request):
        """List services included with a specific apartment."""
        apartment_id = request.query_params.get('apartment_id')
        if not apartment_id:
            return Response(
                {"error": "apartment_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Import here to avoid circular imports
        from apps.apartments.models import Apartment
        
        try:
            apartment = Apartment.objects.get(id=apartment_id)
            included_services = apartment.amenities.all()
            serializer = ServiceForReservationSerializer(included_services, many=True)
            return Response(serializer.data)
        except Apartment.DoesNotExist:
            return Response(
                {"error": "Apartment not found."},
                status=status.HTTP_404_NOT_FOUND
            )
