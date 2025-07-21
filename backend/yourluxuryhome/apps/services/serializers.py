from rest_framework import serializers
from .models import ServiceType, Service


class ServiceTypeSerializer(serializers.ModelSerializer):
    """Serializer for ServiceType model"""
    service_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceType
        fields = ['id', 'name', 'description', 'icon', 'order', 'service_count']
    
    def get_service_count(self, obj):
        return obj.services.filter(is_active=True).count()


class ServiceListSerializer(serializers.ModelSerializer):
    """Serializer for listing services"""
    type_name = serializers.ReadOnlyField(source='type.name')
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'type', 'type_name', 
                  'icon', 'is_free', 'is_featured', 'unit_label']


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed service information"""
    type = ServiceTypeSerializer(read_only=True)
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'type', 'icon',
                  'is_active', 'is_featured', 'max_quantity', 'unit_label',
                  'is_free', 'created_at', 'updated_at']


class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating services"""
    class Meta:
        model = Service
        fields = ['name', 'description', 'price', 'type', 'icon',
                  'is_active', 'is_featured', 'max_quantity', 'unit_label']


class ServiceTypeWithServicesSerializer(serializers.ModelSerializer):
    """Serializer for service types with their associated services"""
    services = ServiceListSerializer(many=True, read_only=True, source='services.filter(is_active=True)')
    
    class Meta:
        model = ServiceType
        fields = ['id', 'name', 'description', 'icon', 'order', 'services']


class ServiceForReservationSerializer(serializers.ModelSerializer):
    """Simplified serializer for services in reservation context"""
    type_name = serializers.ReadOnlyField(source='type.name')
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'type_name', 'icon', 'is_free', 'unit_label']
