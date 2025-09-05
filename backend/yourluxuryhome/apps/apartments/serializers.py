from rest_framework import serializers
from django.db.models import Avg
from .models import (
    Apartment, ApartmentCategory, ApartmentAmenity, ApartmentImage, ApartmentReview, ApartmentAvailability,
    VirtualTourRoom, RoomConnection, VirtualTourHotspot
)
from apps.services.serializers import ServiceListSerializer
from datetime import date, timedelta


class ApartmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentCategory
        fields = ['id', 'name', 'description']


class ApartmentAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentAmenity
        fields = ['id', 'name', 'description', 'icon']


class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image', 'caption', 'is_primary']


class ApartmentReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ApartmentReview
        fields = ['id', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class ApartmentListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    amenities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Apartment
        fields = [
            'id', 'name', 'slug', 'description', 'address', 'city', 'country',
            'price_per_night', 'bedrooms', 'bathrooms', 'max_guests',
            'category', 'category_name', 'primary_image', 'average_rating',
            'review_count', 'amenities_count', 'is_available'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return ApartmentImageSerializer(primary_image).data
        # If no primary image, return the first image
        first_image = obj.images.first()
        if first_image:
            return ApartmentImageSerializer(first_image).data
        return None
    
    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return avg if avg else 0
    
    def get_review_count(self, obj):
        return obj.reviews.count()
    
    def get_amenities_count(self, obj):
        return obj.amenities.count()


class ApartmentDetailSerializer(serializers.ModelSerializer):
    category = ApartmentCategorySerializer(read_only=True)
    amenities = ApartmentAmenitySerializer(many=True, read_only=True)
    images = ApartmentImageSerializer(many=True, read_only=True)
    reviews = ApartmentReviewSerializer(many=True, read_only=True)
    included_services = ServiceListSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    is_booked = serializers.SerializerMethodField()
    
    class Meta:
        model = Apartment
        fields = [
            'id', 'name', 'slug', 'description', 'address', 'city', 'country',
            'postal_code', 'latitude', 'longitude', 'price_per_night',
            'bedrooms', 'bathrooms', 'max_guests', 'size_sqm', 'category',
            'amenities', 'included_services', 'images', 'reviews', 'average_rating', 'review_count',
            'is_available', 'is_booked', 'created_at', 'updated_at'
        ]
    
    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return avg if avg else 0
    
    def get_review_count(self, obj):
        return obj.reviews.count()
    
    def get_is_booked(self, obj):
        # Check if check-in and check-out dates are provided in the context
        request = self.context.get('request')
        if request and request.query_params.get('check_in_date') and request.query_params.get('check_out_date'):
            check_in_date = request.query_params.get('check_in_date')
            check_out_date = request.query_params.get('check_out_date')
            return obj.is_booked(check_in_date, check_out_date)
        return False


class ApartmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = [
            'name', 'description', 'address', 'city', 'country', 'postal_code',
            'latitude', 'longitude', 'category', 'price_per_night', 'bedrooms',
            'bathrooms', 'max_guests', 'size_sqm', 'amenities', 'is_available'
        ]


class ApartmentImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['apartment', 'image', 'caption', 'is_primary']


class ApartmentReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentReview
        fields = ['rating', 'comment']


class ApartmentReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentReview
        fields = ['apartment', 'rating', 'comment']

    def validate(self, data):
        """
        Check that the user has not already reviewed this apartment.
        """
        user = self.context['request'].user
        apartment = data.get('apartment')
        if apartment and user and ApartmentReview.objects.filter(apartment=apartment, user=user).exists():
            raise serializers.ValidationError({'detail': 'You have already reviewed this apartment.'})
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ApartmentAvailabilitySerializer(serializers.ModelSerializer):
    apartment_name = serializers.ReadOnlyField(source='apartment.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    effective_price = serializers.SerializerMethodField()
    
    class Meta:
        model = ApartmentAvailability
        fields = ['id', 'apartment', 'apartment_name', 'date', 'status', 'status_display', 
                  'price_override', 'effective_price', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_effective_price(self, obj):
        """Return the price_override if set, otherwise the apartment's default price."""
        return obj.price_override if obj.price_override else obj.apartment.price_per_night


class ApartmentAvailabilityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentAvailability
        fields = ['apartment', 'date', 'status', 'price_override', 'notes']
    
    def validate(self, data):
        # Check if the date is not in the past
        if data.get('date') and data['date'] < date.today():
            raise serializers.ValidationError({'date': 'Cannot set availability for past dates'})
        return data


class ApartmentAvailabilityBulkCreateSerializer(serializers.Serializer):
    apartment = serializers.PrimaryKeyRelatedField(queryset=Apartment.objects.all())
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    status = serializers.ChoiceField(choices=ApartmentAvailability.STATUS_CHOICES)
    price_override = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        # Check if end_date is after start_date
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError({'end_date': 'End date must be after start date'})
        
        # Check if the date range is not in the past
        if data['start_date'] < date.today():
            raise serializers.ValidationError({'start_date': 'Cannot set availability for past dates'})
        
        # Limit the range to a reasonable number (e.g., 365 days)
        if (data['end_date'] - data['start_date']).days > 365:
            raise serializers.ValidationError({'end_date': 'Date range cannot exceed 365 days'})
        
        return data
    
    def create(self, validated_data):
        apartment = validated_data['apartment']
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        status = validated_data['status']
        price_override = validated_data.get('price_override')
        notes = validated_data.get('notes', '')
        
        # Create availability entries for each date in the range
        availabilities = []
        current_date = start_date
        while current_date <= end_date:
            # Check if an entry already exists for this date
            existing = ApartmentAvailability.objects.filter(
                apartment=apartment,
                date=current_date
            ).first()
            
            if existing:
                # Update existing entry
                existing.status = status
                existing.price_override = price_override
                existing.notes = notes
                existing.save()
                availabilities.append(existing)
            else:
                # Create new entry
                availability = ApartmentAvailability.objects.create(
                    apartment=apartment,
                    date=current_date,
                    status=status,
                    price_override=price_override,
                    notes=notes
                )
                availabilities.append(availability)
            
            current_date += timedelta(days=1)
        
        return availabilities


class VirtualTourHotspotSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualTourHotspot
        fields = [
            'id', 'hotspot_type', 'position_x', 'position_y', 
            'title', 'description', 'icon', 'connected_room', 'is_active'
        ]


class RoomConnectionSerializer(serializers.ModelSerializer):
    to_room_name = serializers.ReadOnlyField(source='to_room.name')
    to_room_type = serializers.ReadOnlyField(source='to_room.room_type')
    
    class Meta:
        model = RoomConnection
        fields = [
            'id', 'to_room', 'to_room_name', 'to_room_type',
            'hotspot_x', 'hotspot_y', 'direction_label',
            'icon', 'hotspot_size', 'hotspot_color',
            'transition_yaw', 'transition_pitch', 'transition_animation',
            'is_active', 'show_on_hover', 'pulse_animation'
        ]


class VirtualTourRoomSerializer(serializers.ModelSerializer):
    connections_from = RoomConnectionSerializer(many=True, read_only=True)
    hotspots = VirtualTourHotspotSerializer(many=True, read_only=True)
    panoramic_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = VirtualTourRoom
        fields = [
            'id', 'name', 'room_type', 'panoramic_image', 'panoramic_image_url',
            'description', 'order', 'is_starting_room', 'initial_yaw', 'initial_pitch',
            'connections_from', 'hotspots'
        ]
    
    def get_panoramic_image_url(self, obj):
        if obj.panoramic_image and hasattr(obj.panoramic_image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.panoramic_image.url)
            return obj.panoramic_image.url
        return None


class VirtualTourSerializer(serializers.Serializer):
    apartment_id = serializers.UUIDField(read_only=True)
    apartment_name = serializers.CharField(read_only=True)
    rooms = VirtualTourRoomSerializer(many=True, read_only=True)
    starting_room = VirtualTourRoomSerializer(read_only=True)
    room_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        fields = ['apartment_id', 'apartment_name', 'rooms', 'starting_room', 'room_count']


class VirtualTourRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualTourRoom
        fields = [
            'apartment', 'name', 'room_type', 'panoramic_image',
            'description', 'order', 'is_starting_room', 'initial_yaw', 'initial_pitch'
        ]


class RoomConnectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomConnection
        fields = [
            'from_room', 'to_room', 'hotspot_x', 'hotspot_y',
            'direction_label', 'icon', 'hotspot_size', 'hotspot_color',
            'transition_yaw', 'transition_pitch', 'transition_animation',
            'is_active', 'show_on_hover', 'pulse_animation'
        ]
    
    def validate(self, data):
        if data['from_room'].apartment != data['to_room'].apartment:
            raise serializers.ValidationError({'detail': 'Rooms must belong to the same apartment'})
        if data['from_room'] == data['to_room']:
            raise serializers.ValidationError({'detail': 'Room cannot connect to itself'})
        return data


class VirtualTourHotspotCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualTourHotspot
        fields = [
            'room', 'hotspot_type', 'position_x', 'position_y',
            'title', 'description', 'icon', 'connected_room', 'is_active'
        ]
