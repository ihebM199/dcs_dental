"""
Signals for the orders app.
Triggers notification emails when orders are created.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.orders.models import Order


@receiver(post_save, sender=Order)
def order_created_notification(sender, instance, created, **kwargs):
    """Send notification emails when a new order is created."""
    if created:
        try:
            from apps.notifications.tasks import (
                send_order_admin_notification,
                send_order_customer_confirmation,
            )
            send_order_admin_notification.delay(instance.id)
            send_order_customer_confirmation.delay(instance.id)
        except Exception:
            # Don't fail order creation if notifications fail
            pass
