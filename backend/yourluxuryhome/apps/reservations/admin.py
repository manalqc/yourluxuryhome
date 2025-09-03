from django.contrib import admin
from .models import Reservation, ReservationService, ReservationStatus

class ReservationServiceInline(admin.TabularInline):
    model = ReservationService
    extra = 0
    fields = ['service', 'quantity', 'price', 'notes']
    autocomplete_fields = ['service']

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'apartment', 'check_in_date', 'check_out_date', 'guests', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'check_in_date', 'check_out_date', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'apartment__name', 'whatsapp_number']
    list_editable = ['status']
    date_hierarchy = 'check_in_date'
    readonly_fields = ['id', 'created_at', 'updated_at', 'duration_days']
    inlines = [ReservationServiceInline]
    autocomplete_fields = ['user', 'apartment']
    
    fieldsets = (
        ('Reservation Information', {
            'fields': ('id', 'user', 'apartment')
        }),
        ('Booking Details', {
            'fields': ('check_in_date', 'check_out_date', 'duration_days', 'guests')
        }),
        ('Pricing', {
            'fields': ('total_price',)
        }),
        ('Status & Contact', {
            'fields': ('status', 'whatsapp_number', 'special_requests')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def duration_days(self, obj):
        return obj.duration_days()
    duration_days.short_description = 'Duration (days)'
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('user', 'apartment')
        return queryset
    
    actions = ['mark_as_confirmed', 'mark_as_cancelled', 'mark_as_completed']
    
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status=ReservationStatus.CONFIRMED)
        self.message_user(request, f'{updated} reservation(s) marked as confirmed.')
    mark_as_confirmed.short_description = 'Mark selected reservations as confirmed'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status=ReservationStatus.CANCELLED)
        self.message_user(request, f'{updated} reservation(s) marked as cancelled.')
    mark_as_cancelled.short_description = 'Mark selected reservations as cancelled'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status=ReservationStatus.COMPLETED)
        self.message_user(request, f'{updated} reservation(s) marked as completed.')
    mark_as_completed.short_description = 'Mark selected reservations as completed'

@admin.register(ReservationService)
class ReservationServiceAdmin(admin.ModelAdmin):
    list_display = ['reservation', 'service', 'quantity', 'price', 'created_at']
    list_filter = ['created_at', 'service__type']
    search_fields = ['reservation__id', 'service__name', 'notes']
    readonly_fields = ['created_at']
    autocomplete_fields = ['reservation', 'service']
    
    fieldsets = (
        ('Service Information', {
            'fields': ('reservation', 'service')
        }),
        ('Details', {
            'fields': ('quantity', 'price', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('reservation', 'service')
        return queryset