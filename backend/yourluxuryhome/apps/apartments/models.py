from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from datetime import date
from apps.services.models import Service


def validate_panoramic_image(image):
    """Validate that uploaded image is suitable for 360° panoramic display."""
    try:
        width, height = get_image_dimensions(image)
        if width and height:
            aspect_ratio = width / height
            # Check if image has roughly 2:1 aspect ratio (equirectangular)
            if not (1.8 <= aspect_ratio <= 2.2):
                raise ValidationError(
                    _('Panoramic image should have 2:1 aspect ratio (e.g., 4096x2048). '
                      f'Current aspect ratio: {aspect_ratio:.2f}:1')
                )
            # Check minimum resolution
            if width < 2048 or height < 1024:
                raise ValidationError(
                    _('Panoramic image should be at least 2048x1024 pixels. '
                      f'Current size: {width}x{height}')
                )
            # Check maximum file size (10MB)
            if image.size > 10 * 1024 * 1024:
                raise ValidationError(
                    _('Panoramic image file size should not exceed 10MB. '
                      f'Current size: {image.size / (1024*1024):.1f}MB')
                )
    except Exception as e:
        raise ValidationError(_('Unable to validate image: %s') % str(e))


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


class VirtualTourRoom(models.Model):
    """Model to store 360° panoramic rooms for virtual tours."""
    
    ROOM_TYPES = (
        ('living_room', _('Living Room')),
        ('bedroom', _('Bedroom')),
        ('kitchen', _('Kitchen')),
        ('bathroom', _('Bathroom')),
        ('dining_room', _('Dining Room')),
        ('balcony', _('Balcony')),
        ('terrace', _('Terrace')),
        ('office', _('Office')),
        ('hallway', _('Hallway')),
        ('entrance', _('Entrance')),
        ('other', _('Other')),
    )
    
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='virtual_tour_rooms')
    name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    panoramic_image = models.ImageField(
        upload_to='virtual_tour/panoramas/',
        validators=[validate_panoramic_image],
        help_text=_('Upload equirectangular panoramic image (2:1 aspect ratio, min 2048x1024, max 10MB)')
    )
    description = models.TextField(blank=True, null=True)
    order = models.PositiveSmallIntegerField(default=0, help_text=_('Display order in virtual tour'))
    is_starting_room = models.BooleanField(default=False, help_text=_('Is this the starting room for the virtual tour?'))
    
    # Position data for 360° navigation
    initial_yaw = models.FloatField(default=0.0, help_text=_('Initial horizontal viewing angle in degrees'))
    initial_pitch = models.FloatField(default=0.0, help_text=_('Initial vertical viewing angle in degrees'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = _('Virtual Tour Room')
        verbose_name_plural = _('Virtual Tour Rooms')
    
    def __str__(self):
        return f"{self.apartment.name} - {self.name}"
    
    def save(self, *args, **kwargs):
        # Ensure only one starting room per apartment
        if self.is_starting_room:
            VirtualTourRoom.objects.filter(
                apartment=self.apartment, 
                is_starting_room=True
            ).exclude(pk=self.pk).update(is_starting_room=False)
        super().save(*args, **kwargs)


class RoomConnection(models.Model):
    """Model to define connections between virtual tour rooms."""
    
    from_room = models.ForeignKey(VirtualTourRoom, on_delete=models.CASCADE, related_name='connections_from')
    to_room = models.ForeignKey(VirtualTourRoom, on_delete=models.CASCADE, related_name='connections_to')
    
    # Hotspot position in the panoramic image (percentage-based 0-100)
    hotspot_x = models.FloatField(help_text=_('X position of hotspot (0.0 to 100.0 percent)'),
                                   validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    hotspot_y = models.FloatField(help_text=_('Y position of hotspot (0.0 to 100.0 percent)'),
                                   validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    
    # Direction label for UI
    direction_label = models.CharField(max_length=50, blank=True, null=True, 
                                     help_text=_('Label for the connection (e.g., "To Kitchen", "Exit to Balcony")'))
    
    # Hotspot appearance
    icon = models.CharField(max_length=50, default='door', 
                           help_text=_('Icon type: door, archway, stairs, elevator, balcony'))
    hotspot_size = models.IntegerField(default=50, help_text=_('Size of hotspot in pixels'))
    hotspot_color = models.CharField(max_length=7, default='#d9b38a', help_text=_('Hotspot color in hex'))
    
    # Transition settings
    transition_yaw = models.FloatField(default=0.0, help_text=_('Target viewing angle after transition'))
    transition_pitch = models.FloatField(default=0.0, help_text=_('Target pitch angle after transition'))
    transition_animation = models.CharField(max_length=20, default='fade', 
                                           choices=(('fade', 'Fade'), ('slide', 'Slide'), ('zoom', 'Zoom')))
    
    # Display settings
    is_active = models.BooleanField(default=True, help_text=_('Whether this connection is active'))
    show_on_hover = models.BooleanField(default=True, help_text=_('Show label on hover'))
    pulse_animation = models.BooleanField(default=True, help_text=_('Show pulse animation'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Room Connection')
        verbose_name_plural = _('Room Connections')
        unique_together = ('from_room', 'to_room')
    
    def __str__(self):
        return f"{self.from_room.name} → {self.to_room.name}"
    
    def clean(self):
        """Validate that rooms belong to the same apartment and prevent self-connections."""
        if self.from_room.apartment != self.to_room.apartment:
            raise ValidationError(_('Rooms must belong to the same apartment'))
        if self.from_room == self.to_room:
            raise ValidationError(_('Room cannot connect to itself'))
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class VirtualTourHotspot(models.Model):
    """Model for interactive hotspots within virtual tour rooms."""
    
    HOTSPOT_TYPES = (
        ('navigation', _('Navigation')),
        ('info', _('Information')),
        ('feature', _('Feature Highlight')),
        ('amenity', _('Amenity')),
    )
    
    room = models.ForeignKey(VirtualTourRoom, on_delete=models.CASCADE, related_name='hotspots')
    hotspot_type = models.CharField(max_length=20, choices=HOTSPOT_TYPES, default='info')
    
    # Position in panoramic image (normalized coordinates)
    position_x = models.FloatField(help_text=_('X position (0.0 to 1.0)'))
    position_y = models.FloatField(help_text=_('Y position (0.0 to 1.0)'))
    
    # Content
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True, help_text=_('Icon name for frontend display'))
    
    # Navigation (if this is a navigation hotspot)
    connected_room = models.ForeignKey(VirtualTourRoom, on_delete=models.CASCADE, 
                                     related_name='incoming_hotspots', blank=True, null=True)
    
    # Display settings
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('Virtual Tour Hotspot')
        verbose_name_plural = _('Virtual Tour Hotspots')
    
    def __str__(self):
        return f"{self.room.name} - {self.title}"
