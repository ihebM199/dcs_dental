"""
Signals for the orders app.
Triggers notification emails on order creation and status changes.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.orders.models import Order


@receiver(pre_save, sender=Order)
def cache_order_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._old_status = Order.objects.get(pk=instance.pk).status
        except Order.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Order)
def order_status_notification(sender, instance, created, **kwargs):
    if created:
        return

    try:
        from apps.notifications.tasks import send_order_status_notification
        from apps.notifications.utils import dispatch_after_commit

        old_status = getattr(instance, '_old_status', None)
        if old_status and old_status != instance.status:
            dispatch_after_commit(send_order_status_notification, instance.id, old_status)
    except Exception:
        pass
