from rest_framework import serializers
from django.db.models import Avg
from .models import Apartment, ApartmentCategory, ApartmentAmenity, ApartmentImage, ApartmentReview
from apps.services.serializers import ServiceListSerializer


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


class ApartmentReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentReview
        fields = ['apartment', 'rating', 'comment']
    
    def create(self, validated_data):
        # Set the user from the request context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
