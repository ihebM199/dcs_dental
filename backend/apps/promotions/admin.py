"""Admin configuration for the promotions app."""
from django.contrib import admin
from apps.promotions.models import PromoCode


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percentage', 'is_active', 'times_used', 'expires_at']
    list_filter = ['is_active', 'expires_at']
    search_fields = ['code', 'description']
