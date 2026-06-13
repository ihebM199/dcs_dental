"""
Models for the promotions app.
Matches frontend Coupon interface (code, discountPct, expires).
"""
from django.db import models
from django.utils import timezone


class PromoCode(models.Model):
    """Promotional discount code."""

    code = models.CharField('Code', max_length=30, unique=True)
    description = models.CharField('Description', max_length=255)
    discount_percentage = models.DecimalField(
        'Pourcentage de remise', max_digits=5, decimal_places=2,
    )
    category = models.ForeignKey(
        'products.Category', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='promo_codes',
        verbose_name='Catégorie (optionnel)',
    )
    min_order_amount = models.DecimalField(
        'Montant minimum', max_digits=10, decimal_places=3, default=0,
    )
    max_uses = models.PositiveIntegerField(
        'Utilisations max (0=illimité)', default=0,
    )
    times_used = models.PositiveIntegerField('Utilisations', default=0)
    is_active = models.BooleanField('Actif', default=True)
    expires_at = models.DateTimeField('Date d\'expiration')
    created_at = models.DateTimeField('Créé le', auto_now_add=True)

    class Meta:
        verbose_name = 'Code promo'
        verbose_name_plural = 'Codes promo'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.code} (-{self.discount_percentage}%)'

    def save(self, *args, **kwargs):
        self.code = self.code.upper()
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        if not self.is_active or self.is_expired:
            return False
        if self.max_uses > 0 and self.times_used >= self.max_uses:
            return False
        return True
