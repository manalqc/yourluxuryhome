from django.contrib import admin
from .models import Service, ServiceType

@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'icon', 'order', 'created_at']
    list_editable = ['order', 'icon']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'icon')
        }),
        ('Display Settings', {
            'fields': ('order',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'price', 'unit_label', 'is_active', 'is_featured', 'created_at']
    list_filter = ['type', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_active', 'is_featured']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'type', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'unit_label', 'max_quantity')
        }),
        ('Display Settings', {
            'fields': ('icon', 'is_active', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('type')
        return queryset