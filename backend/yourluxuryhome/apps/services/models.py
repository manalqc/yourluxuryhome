from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class ServiceType(models.Model):
    """Model for categorizing services (e.g., Transport, Wellness, Dining)"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)  # For frontend icon display
    order = models.PositiveSmallIntegerField(default=0)  # For controlling display order
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Service Type')
        verbose_name_plural = _('Service Types')
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Service(models.Model):
    """Model for individual services that can be included with apartments or added to reservations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text=_('Price per unit (0 if included)'))
    type = models.ForeignKey(ServiceType, on_delete=models.CASCADE, related_name='services')
    icon = models.CharField(max_length=50, blank=True, null=True)  # For frontend icon display
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    max_quantity = models.PositiveSmallIntegerField(default=1, help_text=_('Maximum quantity that can be selected'))
    unit_label = models.CharField(max_length=50, default='unit', help_text=_('Label for the unit (e.g., hour, day, session)'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')
        ordering = ['type__order', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.type.name})"
    
    @property
    def is_free(self):
        """Check if the service is free (included)"""
        return self.price == 0
