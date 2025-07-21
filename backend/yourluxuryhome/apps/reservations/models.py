from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
import uuid


class ReservationStatus(models.TextChoices):
    PENDING = 'pending', _('Pending')
    CONFIRMED = 'confirmed', _('Confirmed')
    CANCELLED = 'cancelled', _('Cancelled')
    COMPLETED = 'completed', _('Completed')


class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    apartment = models.ForeignKey(
        'apartments.Apartment',
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    guests = models.PositiveSmallIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=ReservationStatus.choices,
        default=ReservationStatus.PENDING
    )
    special_requests = models.TextField(blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Reservation')
        verbose_name_plural = _('Reservations')
    
    def __str__(self):
        return f"Reservation {self.id} - {self.user.email} - {self.check_in_date} to {self.check_out_date}"
    
    def is_active(self):
        return self.status in [ReservationStatus.PENDING, ReservationStatus.CONFIRMED]
    
    def is_past_reservation(self):
        return self.check_out_date < timezone.now().date()
    
    def duration_days(self):
        return (self.check_out_date - self.check_in_date).days


class ReservationService(models.Model):
    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.CASCADE,
        related_name='services'
    )
    service = models.ForeignKey(
        'services.Service',
        on_delete=models.CASCADE,
        related_name='reservation_services'
    )
    quantity = models.PositiveSmallIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['reservation', 'service']
        verbose_name = _('Reservation Service')
        verbose_name_plural = _('Reservation Services')
    
    def __str__(self):
        return f"{self.service.name} for {self.reservation.id}"
