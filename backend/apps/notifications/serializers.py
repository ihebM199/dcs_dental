"""Serializers for the notifications app."""
from rest_framework import serializers

from apps.notifications.models import NewsletterSubscriber


class NewsletterSubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, validated_data):
        email = validated_data['email'].lower().strip()
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={'is_active': True},
        )
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save(update_fields=['is_active'])
        return subscriber
