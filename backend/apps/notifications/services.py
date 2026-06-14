"""
Email notification services for DCS Dental.
"""
import logging

from django.conf import settings
from django.core.mail import send_mail

from apps.notifications.models import NewsletterSubscriber

logger = logging.getLogger(__name__)


def _admin_email():
    return getattr(settings, 'ADMIN_EMAIL', '') or settings.EMAIL_HOST_USER


def _send(recipient, subject, message):
    if not recipient:
        logger.warning('Notification ignorée : destinataire manquant.')
        return False
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
        return True
    except Exception:
        logger.exception('Échec envoi email à %s — sujet: %s', recipient, subject)
        return False


def _broadcast(subject, message):
    emails = list(
        NewsletterSubscriber.objects.filter(is_active=True).values_list('email', flat=True)
    )
    if not emails:
        logger.info('Aucun abonné newsletter actif pour : %s', subject)
        return 0

    sent = 0
    for email in emails:
        if _send(email, subject, message):
            sent += 1
    return sent


def notify_admin_new_order(order):
    """Notify admin when a client places a new order."""
    items_lines = '\n'.join(
        f"  - {item.quantity}x {item.product_name} ({item.subtotal} TND)"
        for item in order.items.all()
    )
    message = (
        f"Nouvelle commande reçue !\n\n"
        f"Numéro : {order.order_number}\n"
        f"Client : {order.user.full_name} ({order.user.email})\n"
        f"Téléphone : {order.shipping_phone}\n"
        f"Adresse : {order.shipping_address}\n\n"
        f"Articles :\n{items_lines}\n\n"
        f"Montant total : {order.total_amount} TND\n"
        f"Remise : {order.discount_amount} TND\n"
        f"Montant final : {order.final_amount} TND\n"
        f"Statut : {order.get_status_display()}\n"
    )
    return _send(_admin_email(), f'[DCS Store] Nouvelle commande {order.order_number}', message)


def notify_client_order_status(order, old_status):
    """Notify client when admin updates order status."""
    old_label = dict(order.Status.choices).get(old_status, old_status)
    new_label = order.get_status_display()
    message = (
        f"Bonjour {order.user.first_name or order.user.full_name},\n\n"
        f"Le statut de votre commande {order.order_number} a été mis à jour.\n\n"
        f"Ancien statut : {old_label}\n"
        f"Nouveau statut : {new_label}\n\n"
        f"Montant : {order.final_amount} TND\n"
        f"Adresse de livraison : {order.shipping_address}\n\n"
        f"Merci de votre confiance,\n"
        f"L'équipe DCS Store"
    )
    return _send(
        order.user.email,
        f'[DCS Store] Commande {order.order_number} — {new_label}',
        message,
    )


def notify_subscribers_promo_code(promo):
    """Notify newsletter subscribers about a new or published promo code."""
    expires = promo.expires_at.strftime('%d/%m/%Y à %H:%M')
    message = (
        f"Bonne nouvelle ! Un nouveau code promo est disponible sur DCS Store.\n\n"
        f"Code : {promo.code}\n"
        f"Description : {promo.description}\n"
        f"Remise : {promo.discount_percentage}%\n"
        f"Valable jusqu'au : {expires}\n\n"
        f"Utilisez ce code lors de votre prochaine commande sur notre boutique.\n\n"
        f"L'équipe DCS Store"
    )
    return _broadcast(
        f'[DCS Store] Nouveau code promo : {promo.code} (-{promo.discount_percentage}%)',
        message,
    )


def notify_subscribers_product_promo(product):
    """Notify newsletter subscribers about a product on promotion."""
    discount = product.discount_percentage
    message = (
        f"Une nouvelle promotion est disponible sur DCS Store !\n\n"
        f"Produit : {product.name}\n"
        f"Prix promo : {product.price} TND"
    )
    if product.old_price:
        message += f" (au lieu de {product.old_price} TND, -{discount}%)"
    message += (
        f"\n\nDécouvrez cette offre sur notre catalogue dès maintenant.\n\n"
        f"L'équipe DCS Store"
    )
    return _broadcast(
        f'[DCS Store] Promotion : {product.name}',
        message,
    )
