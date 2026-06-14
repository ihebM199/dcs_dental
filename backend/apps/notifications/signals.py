"""
Signals for promotion and product email notifications.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.notifications.utils import dispatch_after_commit
from apps.products.models import Product
from apps.promotions.models import PromoCode


@receiver(pre_save, sender=PromoCode)
def cache_promo_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = PromoCode.objects.get(pk=instance.pk)
            instance._was_active = old.is_active
        except PromoCode.DoesNotExist:
            instance._was_active = False
    else:
        instance._was_active = False


@receiver(post_save, sender=PromoCode)
def promo_published_notification(sender, instance, created, **kwargs):
    was_active = getattr(instance, '_was_active', False)
    if not instance.is_active or not instance.is_valid:
        return
    if created or (not was_active and instance.is_active):
        try:
            from apps.notifications.tasks import send_promo_code_notification
            dispatch_after_commit(send_promo_code_notification, instance.id)
        except Exception:
            pass


@receiver(pre_save, sender=Product)
def cache_product_promo_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = Product.objects.get(pk=instance.pk)
            instance._was_promo = old.is_promo
        except Product.DoesNotExist:
            instance._was_promo = False
    else:
        instance._was_promo = False


@receiver(post_save, sender=Product)
def product_promo_published_notification(sender, instance, created, **kwargs):
    if not instance.is_promo or not instance.is_active:
        return
    was_promo = getattr(instance, '_was_promo', False)
    if created or (not was_promo and instance.is_promo):
        try:
            from apps.notifications.tasks import send_product_promo_notification
            dispatch_after_commit(send_product_promo_notification, instance.id)
        except Exception:
            pass
