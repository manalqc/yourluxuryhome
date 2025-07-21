from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.utils import timezone

from rest_framework import status, permissions, generics, viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from apps.common.throttling import ReservationCreateRateThrottle, ReservationListRateThrottle

from .models import Reservation, ReservationService, ReservationStatus
from .serializers import (
    ReservationSerializer,
    ReservationCreateSerializer,
    ReservationUpdateSerializer,
    ReservationServiceSerializer
)


class ReservationViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Reservation instances."""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'check_in_date', 'check_out_date', 'apartment']
    search_fields = ['special_requests', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['created_at', 'check_in_date', 'check_out_date', 'total_price']
    ordering = ['-created_at']
    
    def get_throttles(self):
        """Return appropriate throttle classes based on action."""
        if self.action == 'create':
            throttle_classes = [ReservationCreateRateThrottle]
        elif self.action == 'list':
            throttle_classes = [ReservationListRateThrottle]
        else:
            throttle_classes = []
        return [throttle() for throttle in throttle_classes]
    
    def get_queryset(self):
        user = self.request.user
        # Admin can see all reservations, regular users can only see their own
        if user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReservationCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ReservationUpdateSerializer
        return ReservationSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Here you could add logic to send WhatsApp notification
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """List all active reservations (pending or confirmed)."""
        active_statuses = [ReservationStatus.PENDING, ReservationStatus.CONFIRMED]
        queryset = self.get_queryset().filter(status__in=active_statuses)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def past(self, request):
        """List all past reservations."""
        today = timezone.now().date()
        queryset = self.get_queryset().filter(check_out_date__lt=today)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """List all upcoming reservations."""
        today = timezone.now().date()
        queryset = self.get_queryset().filter(
            check_in_date__gte=today,
            status__in=[ReservationStatus.PENDING, ReservationStatus.CONFIRMED]
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a reservation."""
        reservation = self.get_object()
        if reservation.status == ReservationStatus.CANCELLED:
            return Response({"detail": "Reservation is already cancelled."}, status=status.HTTP_400_BAD_REQUEST)
        
        if reservation.status == ReservationStatus.COMPLETED:
            return Response({"detail": "Cannot cancel a completed reservation."}, status=status.HTTP_400_BAD_REQUEST)
        
        reservation.status = ReservationStatus.CANCELLED
        reservation.save()
        serializer = self.get_serializer(reservation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a reservation (admin only)."""
        if not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        reservation = self.get_object()
        if reservation.status != ReservationStatus.PENDING:
            return Response({"detail": f"Cannot confirm a reservation with status {reservation.status}."}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        reservation.status = ReservationStatus.CONFIRMED
        reservation.save()
        serializer = self.get_serializer(reservation)
        return Response(serializer.data)


class ReservationServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ReservationService instances."""
    serializer_class = ReservationServiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        reservation_id = self.kwargs.get('reservation_pk')
        return ReservationService.objects.filter(reservation__id=reservation_id)
    
    def perform_create(self, serializer):
        reservation_id = self.kwargs.get('reservation_pk')
        reservation = get_object_or_404(Reservation, id=reservation_id)
        
        # Check if the user is the owner of the reservation or an admin
        if self.request.user != reservation.user and not self.request.user.is_staff:
            raise PermissionDenied("You do not have permission to add services to this reservation.")
        
        # Get the service price if not provided
        service = serializer.validated_data.get('service')
        if not serializer.validated_data.get('price') and service:
            serializer.validated_data['price'] = service.price
        
        serializer.save(reservation=reservation)


class UserReservationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing user's reservations with nested routing."""
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'check_in_date', 'check_out_date', 'apartment']
    search_fields = ['special_requests']
    ordering_fields = ['created_at', 'check_in_date', 'check_out_date', 'total_price']
    ordering = ['-created_at']
    throttle_classes = [ReservationListRateThrottle]
    
    def get_queryset(self):
        # The user_pk will be provided by the nested router
        user_id = self.kwargs.get('user_pk')
        
        # Only allow users to see their own reservations or admins to see any user's reservations
        if str(self.request.user.id) == user_id or self.request.user.is_staff:
            return Reservation.objects.filter(user__id=user_id)
        else:
            return Reservation.objects.none()
