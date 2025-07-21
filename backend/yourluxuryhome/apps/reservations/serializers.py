from rest_framework import serializers
from django.utils import timezone
from .models import Reservation, ReservationService, ReservationStatus


class ReservationServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField(source='service.name')
    service_description = serializers.ReadOnlyField(source='service.description')
    
    class Meta:
        model = ReservationService
        fields = ['id', 'service', 'service_name', 'service_description', 'quantity', 'price', 'notes']
        read_only_fields = ['price']


class ReservationSerializer(serializers.ModelSerializer):
    services = ReservationServiceSerializer(many=True, read_only=True)
    apartment_name = serializers.ReadOnlyField(source='apartment.name')
    user_email = serializers.ReadOnlyField(source='user.email')
    user_name = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'user_email', 'user_name', 'apartment', 'apartment_name',
            'check_in_date', 'check_out_date', 'guests', 'total_price', 'status',
            'status_display', 'special_requests', 'whatsapp_number', 'duration',
            'services', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'total_price', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    
    def get_duration(self, obj):
        return obj.duration_days()
    
    def validate(self, data):
        # Validate check-in and check-out dates
        check_in = data.get('check_in_date')
        check_out = data.get('check_out_date')
        
        if check_in and check_out:
            if check_in < timezone.now().date():
                raise serializers.ValidationError({"check_in_date": "Check-in date cannot be in the past."})
            
            if check_out <= check_in:
                raise serializers.ValidationError({"check_out_date": "Check-out date must be after check-in date."})
        
        return data


class ReservationCreateSerializer(ReservationSerializer):
    services = serializers.PrimaryKeyRelatedField(many=True, queryset=ReservationService.objects.all(), required=False)
    
    class Meta(ReservationSerializer.Meta):
        fields = ReservationSerializer.Meta.fields
        read_only_fields = ['id', 'total_price', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        services_data = validated_data.pop('services', [])
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Create reservation
        reservation = Reservation.objects.create(**validated_data)
        
        # Add services if provided
        for service_id in services_data:
            ReservationService.objects.create(
                reservation=reservation,
                service_id=service_id
            )
        
        return reservation


class ReservationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['check_in_date', 'check_out_date', 'guests', 'special_requests', 'status', 'whatsapp_number']
    
    def validate_status(self, value):
        # Only allow certain status transitions
        if self.instance.status == ReservationStatus.CANCELLED and value != ReservationStatus.CANCELLED:
            raise serializers.ValidationError("Cannot change status once reservation is cancelled.")
        
        if self.instance.status == ReservationStatus.COMPLETED and value != ReservationStatus.COMPLETED:
            raise serializers.ValidationError("Cannot change status once reservation is completed.")
        
        return value
