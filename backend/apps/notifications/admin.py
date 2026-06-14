"""Admin configuration for the notifications app."""
from django.contrib import admin

from apps.notifications.models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at']
    list_filter = ['is_active']
    search_fields = ['email']
