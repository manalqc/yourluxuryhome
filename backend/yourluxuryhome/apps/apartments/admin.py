from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.forms import ModelForm, NumberInput
from .models import (
    Apartment, 
    ApartmentCategory, 
    ApartmentAmenity, 
    ApartmentImage, 
    ApartmentReview, 
    ApartmentAvailability,
    VirtualTourRoom,
    RoomConnection,
    VirtualTourHotspot
)

class ApartmentImageInline(admin.TabularInline):
    model = ApartmentImage
    extra = 1
    fields = ['image', 'caption', 'is_primary']

class ApartmentAvailabilityInline(admin.TabularInline):
    model = ApartmentAvailability
    extra = 0
    fields = ['date', 'status', 'price_override', 'notes']


class VirtualTourRoomInlineForm(ModelForm):
    """Custom form for Virtual Tour Room inline with enhanced widgets."""
    
    class Meta:
        model = VirtualTourRoom
        fields = '__all__'
        widgets = {
            'initial_yaw': NumberInput(attrs={
                'min': 0, 'max': 360, 'step': 1,
                'style': 'width: 100px;',
                'placeholder': '0-360°'
            }),
            'initial_pitch': NumberInput(attrs={
                'min': -90, 'max': 90, 'step': 1,
                'style': 'width: 100px;', 
                'placeholder': '-90 to +90°'
            }),
            'order': NumberInput(attrs={
                'min': 0, 'max': 100, 'step': 1,
                'style': 'width: 80px;'
            }),
        }


class VirtualTourRoomInline(admin.StackedInline):
    """Inline for managing virtual tour rooms within an apartment."""
    model = VirtualTourRoom
    form = VirtualTourRoomInlineForm
    extra = 0
    fields = [
        ('name', 'room_type', 'order'),
        'panoramic_image',
        'description',
        ('initial_yaw', 'initial_pitch'),
        'is_starting_room'
    ]
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('order')

@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'country', 'price_per_night', 'bedrooms', 'max_guests', 'category', 'is_available']
    list_filter = ['category', 'country', 'city', 'is_available', 'bedrooms', 'bathrooms']
    search_fields = ['name', 'description', 'address', 'city', 'country']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['amenities', 'included_services']
    inlines = [ApartmentImageInline, ApartmentAvailabilityInline, VirtualTourRoomInline]
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'slug', 'category', 'description')
        }),
        ('Location', {
            'fields': ('address', 'city', 'country', 'postal_code', 'latitude', 'longitude')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'max_guests', 'size_sqm')
        }),
        ('Pricing & Availability', {
            'fields': ('price_per_night', 'is_available')
        }),
        ('Features & Services', {
            'fields': ('amenities', 'included_services')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ApartmentCategory)
class ApartmentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ApartmentAmenity)
class ApartmentAmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'description', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['icon']
    readonly_fields = ['created_at']

@admin.register(ApartmentImage)
class ApartmentImageAdmin(admin.ModelAdmin):
    list_display = ['apartment', 'caption', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'apartment']
    search_fields = ['caption', 'apartment__name']
    list_editable = ['is_primary']
    readonly_fields = ['created_at']

@admin.register(ApartmentReview)
class ApartmentReviewAdmin(admin.ModelAdmin):
    list_display = ['apartment', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['apartment__name', 'user__email', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('apartment', 'user', 'rating', 'comment')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ApartmentAvailability)
class ApartmentAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['apartment', 'date', 'status', 'price_override']
    list_filter = ['status', 'date']
    search_fields = ['apartment__name', 'notes']
    list_editable = ['status', 'price_override']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at']


# =============================================================================
# VIRTUAL TOUR ADMIN INTERFACES
# =============================================================================



class VirtualTourHotspotInline(admin.TabularInline):
    """Inline for managing hotspots within a virtual tour room."""
    model = VirtualTourHotspot
    fk_name = 'room'
    extra = 0
    fields = ['hotspot_type', 'title', 'description', 'position_x', 'position_y', 'icon', 'connected_room', 'is_active']
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "connected_room":
            # Only show rooms from the same apartment
            if hasattr(request, '_obj_') and request._obj_:
                kwargs["queryset"] = VirtualTourRoom.objects.filter(apartment=request._obj_.apartment)
            else:
                # For new objects, show all rooms but they'll be filtered client-side
                kwargs["queryset"] = VirtualTourRoom.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class RoomConnectionInline(admin.TabularInline):
    """Inline for managing room connections."""
    model = RoomConnection
    fk_name = 'from_room'
    extra = 0
    fields = ['to_room', 'direction_label', 'hotspot_x', 'hotspot_y', 'transition_yaw', 'transition_pitch']
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "to_room":
            # Only show rooms from the same apartment, excluding the current room
            if hasattr(request, '_obj_') and request._obj_:
                kwargs["queryset"] = VirtualTourRoom.objects.filter(
                    apartment=request._obj_.apartment
                ).exclude(pk=request._obj_.pk)
            else:
                # For new objects, show all rooms
                kwargs["queryset"] = VirtualTourRoom.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)




@admin.register(VirtualTourRoom)
class VirtualTourRoomAdmin(admin.ModelAdmin):
    """Admin interface for Virtual Tour Rooms."""
    form = VirtualTourRoomInlineForm
    list_display = ['apartment', 'name', 'room_type', 'order', 'image_preview', 'is_starting_room', 'created_at']
    list_filter = ['apartment', 'room_type', 'is_starting_room']
    search_fields = ['apartment__name', 'name', 'description']
    list_editable = ['order', 'is_starting_room']
    inlines = [VirtualTourHotspotInline, RoomConnectionInline]
    readonly_fields = ['created_at', 'updated_at', 'image_preview_large']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('apartment', 'name', 'room_type', 'description', 'order')
        }),
        ('360° Panoramic Image', {
            'fields': ('panoramic_image', 'image_preview_large'),
            'description': 'Upload equirectangular panoramic images (2:1 ratio, e.g., 4096x2048 pixels)'
        }),
        ('Camera Settings', {
            'fields': ('initial_yaw', 'initial_pitch', 'is_starting_room'),
            'description': 'Set the initial viewing direction when users enter this room'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_form(self, request, obj=None, **kwargs):
        # Store the object in request for use in inlines
        request._obj_ = obj
        return super().get_form(request, obj, **kwargs)
    
    def image_preview(self, obj):
        """Small image preview for list display."""
        if obj.panoramic_image:
            return format_html(
                '<img src="{}" width="80" height="40" style="object-fit: cover; border-radius: 4px;" />',
                obj.panoramic_image.url
            )
        return "No Image"
    image_preview.short_description = "Preview"
    
    def image_preview_large(self, obj):
        """Large image preview for form display."""
        if obj.panoramic_image:
            return format_html(
                '<div style="margin: 10px 0;">'
                '<img src="{}" style="max-width: 600px; max-height: 300px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px;" />'
                '<br><small style="color: #666;">Equirectangular panoramic image (360° x 180°)</small>'
                '</div>',
                obj.panoramic_image.url
            )
        return "No image uploaded"
    image_preview_large.short_description = "Current Image"


@admin.register(VirtualTourHotspot)
class VirtualTourHotspotAdmin(admin.ModelAdmin):
    """Admin interface for Virtual Tour Hotspots."""
    list_display = ['room', 'title', 'hotspot_type', 'position_display', 'connected_room', 'is_active']
    list_filter = ['hotspot_type', 'is_active', 'room__apartment']
    search_fields = ['room__name', 'title', 'description']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Hotspot Information', {
            'fields': ('room', 'hotspot_type', 'title', 'description', 'icon')
        }),
        ('Position Settings', {
            'fields': ('position_x', 'position_y'),
            'description': 'Position in panoramic image (0.0 to 1.0). Use browser tools to find coordinates.'
        }),
        ('Navigation (if applicable)', {
            'fields': ('connected_room',),
            'description': 'Only required for navigation hotspots'
        }),
        ('Display Settings', {
            'fields': ('is_active',)
        })
    )
    
    def position_display(self, obj):
        """Display position as percentage."""
        return f"({obj.position_x:.1%}, {obj.position_y:.1%})"
    position_display.short_description = "Position"
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "connected_room":
            # Filter connected rooms by the same apartment
            if request.resolver_match.kwargs.get('object_id'):
                obj_id = request.resolver_match.kwargs['object_id']
                try:
                    hotspot = VirtualTourHotspot.objects.get(pk=obj_id)
                    kwargs["queryset"] = VirtualTourRoom.objects.filter(
                        apartment=hotspot.room.apartment
                    ).exclude(pk=hotspot.room.pk)
                except VirtualTourHotspot.DoesNotExist:
                    pass
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(RoomConnection)
class RoomConnectionAdmin(admin.ModelAdmin):
    """Admin interface for Room Connections."""
    list_display = ['from_room', 'to_room', 'direction_label', 'hotspot_position', 'transition_angles']
    list_filter = ['from_room__apartment', 'from_room__room_type', 'to_room__room_type']
    search_fields = ['from_room__name', 'to_room__name', 'direction_label']
    
    fieldsets = (
        ('Connection Information', {
            'fields': ('from_room', 'to_room', 'direction_label')
        }),
        ('Hotspot Position', {
            'fields': ('hotspot_x', 'hotspot_y'),
            'description': 'Position of navigation hotspot in the source room (0.0 to 1.0)'
        }),
        ('Transition Settings', {
            'fields': ('transition_yaw', 'transition_pitch'),
            'description': 'Camera angle after transitioning to the target room'
        })
    )
    
    def hotspot_position(self, obj):
        """Display hotspot position as percentage."""
        return f"({obj.hotspot_x:.1%}, {obj.hotspot_y:.1%})"
    hotspot_position.short_description = "Hotspot Position"
    
    def transition_angles(self, obj):
        """Display transition angles."""
        return f"Yaw: {obj.transition_yaw}°, Pitch: {obj.transition_pitch}°"
    transition_angles.short_description = "Transition Angles"
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "to_room":
            # Filter to same apartment, excluding the from_room
            if hasattr(request, 'GET') and request.GET.get('from_room'):
                try:
                    from_room = VirtualTourRoom.objects.get(pk=request.GET['from_room'])
                    kwargs["queryset"] = VirtualTourRoom.objects.filter(
                        apartment=from_room.apartment
                    ).exclude(pk=from_room.pk)
                except VirtualTourRoom.DoesNotExist:
                    pass
        return super().formfield_for_foreignkey(db_field, request, **kwargs)