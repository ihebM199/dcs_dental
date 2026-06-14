"""
Celery tasks for async email notifications.
"""
from celery import shared_task


@shared_task
def send_order_admin_notification(order_id):
    from apps.orders.models import Order
    from apps.notifications.services import notify_admin_new_order

    try:
        order = Order.objects.select_related('user').prefetch_related('items').get(pk=order_id)
    except Order.DoesNotExist:
        return
    notify_admin_new_order(order)


@shared_task
def send_order_status_notification(order_id, old_status):
    from apps.orders.models import Order
    from apps.notifications.services import notify_client_order_status

    try:
        order = Order.objects.select_related('user').get(pk=order_id)
    except Order.DoesNotExist:
        return
    notify_client_order_status(order, old_status)


@shared_task
def send_promo_code_notification(promo_id):
    from apps.promotions.models import PromoCode
    from apps.notifications.services import notify_subscribers_promo_code

    try:
        promo = PromoCode.objects.get(pk=promo_id)
    except PromoCode.DoesNotExist:
        return
    notify_subscribers_promo_code(promo)


@shared_task
def send_product_promo_notification(product_id):
    from apps.products.models import Product
    from apps.notifications.services import notify_subscribers_product_promo

    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return
    notify_subscribers_product_promo(product)
