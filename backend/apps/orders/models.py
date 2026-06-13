"""
Models for the orders app.
"""
import uuid
from datetime import datetime

from django.conf import settings
from django.db import models


class Order(models.Model):
    """Customer order with status tracking."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        CONFIRMED = 'CONFIRMED', 'Confirmée'
        SHIPPING = 'SHIPPING', 'En livraison'
        DELIVERED = 'DELIVERED', 'Livrée'
        CANCELLED = 'CANCELLED', 'Annulée'

    order_number = models.CharField(
        'Numéro de commande', max_length=20, unique=True, editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='orders', verbose_name='Client',
    )
    status = models.CharField(
        'Statut', max_length=15,
        choices=Status.choices, default=Status.PENDING,
    )
    total_amount = models.DecimalField(
        'Montant total', max_digits=12, decimal_places=3, default=0,
    )
    discount_amount = models.DecimalField(
        'Remise', max_digits=12, decimal_places=3, default=0,
    )
    final_amount = models.DecimalField(
        'Montant final', max_digits=12, decimal_places=3, default=0,
    )
    promo_code = models.ForeignKey(
        'promotions.PromoCode', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='orders',
        verbose_name='Code promo',
    )
    shipping_address = models.TextField('Adresse de livraison')
    shipping_phone = models.CharField('Téléphone de livraison', max_length=20)
    notes = models.TextField('Notes', blank=True)
    created_at = models.DateTimeField('Créé le', auto_now_add=True)
    updated_at = models.DateTimeField('Modifié le', auto_now=True)

    class Meta:
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering = ['-created_at']

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            now = datetime.now()
            uid = uuid.uuid4().hex[:4].upper()
            self.order_number = f"ORD-{now.strftime('%Y%m%d')}-{uid}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Individual item in an order (snapshots product data at order time)."""

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE,
        related_name='items', verbose_name='Commande',
    )
    product = models.ForeignKey(
        'products.Product', on_delete=models.SET_NULL,
        null=True, related_name='order_items', verbose_name='Produit',
    )
    product_name = models.CharField('Nom du produit', max_length=255)
    product_price = models.DecimalField(
        'Prix unitaire', max_digits=10, decimal_places=3,
    )
    quantity = models.PositiveIntegerField('Quantité', default=1)
    subtotal = models.DecimalField(
        'Sous-total', max_digits=12, decimal_places=3, default=0,
    )

    class Meta:
        verbose_name = 'Article de commande'
        verbose_name_plural = 'Articles de commande'

    def __str__(self):
        return f'{self.product_name} x{self.quantity}'

    def save(self, *args, **kwargs):
        self.subtotal = self.product_price * self.quantity
        super().save(*args, **kwargs)
