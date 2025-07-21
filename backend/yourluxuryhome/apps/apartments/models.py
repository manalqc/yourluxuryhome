from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils.text import slugify
from django.core.exceptions import ValidationError
import uuid
from datetime import date
from apps.services.models import Service


class ApartmentCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Apartment Category')
        verbose_name_plural = _('Apartment Categories')
    
    def __str__(self):
        return self.name


class ApartmentAmenity(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)  # For frontend icon display
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('Apartment Amenity')
        verbose_name_plural = _('Apartment Amenities')
    
    def __str__(self):
        return self.name


class Apartment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    category = models.ForeignKey(ApartmentCategory, on_delete=models.SET_NULL, null=True, related_name='apartments')
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    bedrooms = models.PositiveSmallIntegerField(default=1)
    bathrooms = models.PositiveSmallIntegerField(default=1)
    max_guests = models.PositiveSmallIntegerField(default=2)
    size_sqm = models.PositiveIntegerField(blank=True, null=True)  # Size in square meters
    amenities = models.ManyToManyField(ApartmentAmenity, related_name='apartments', blank=True)
    included_services = models.ManyToManyField(Service, related_name='included_in_apartments', blank=True, help_text=_('Services included with this apartment'))
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Apartment')
        verbose_name_plural = _('Apartments')
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return f"/apartments/{self.slug}/"
    
    def is_booked(self, check_in_date, check_out_date):
        # Check if apartment is booked for the given dates
        from apps.reservations.models import Reservation, ReservationStatus
        
        overlapping_reservations = Reservation.objects.filter(
            apartment=self,
            status__in=[ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
            check_in_date__lt=check_out_date,
            check_out_date__gt=check_in_date
        )
        
        return overlapping_reservations.exists()


class ApartmentImage(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='apartment_images/')
    caption = models.CharField(max_length=200, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', '-created_at']
        verbose_name = _('Apartment Image')
        verbose_name_plural = _('Apartment Images')
    
    def __str__(self):
        return f"Image for {self.apartment.name}"


class ApartmentReview(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='apartment_reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Apartment Review')
        verbose_name_plural = _('Apartment Reviews')
        unique_together = ['apartment', 'user']  # One review per user per apartment
    
    def __str__(self):
        return f"{self.user.username}'s review for {self.apartment.name}"


class ApartmentAvailability(models.Model):
    """Model to track apartment availability on specific dates."""
    
    STATUS_CHOICES = (
        ('available', _('Available')),
        ('pending', _('Pending')),
        ('booked', _('Booked')),
        ('maintenance', _('Maintenance')),
    )
    
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='availability')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                        help_text=_('Override the default price for this date'))
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Apartment Availability')
        verbose_name_plural = _('Apartment Availabilities')
        ordering = ['date']
        unique_together = ('apartment', 'date')
    
    def __str__(self):
        return f"{self.apartment.name} - {self.date} - {self.get_status_display()}"
    
    def clean(self):
        """Validate that the date is not in the past."""
        if self.date < date.today():
            raise ValidationError({'date': _('Cannot set availability for past dates')})
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
