"""
Models for the notifications app.
"""
from django.db import models


class NewsletterSubscriber(models.Model):
    """Email subscribers who opted in to receive promotions and news."""

    email = models.EmailField('Adresse email', unique=True)
    is_active = models.BooleanField('Actif', default=True)
    subscribed_at = models.DateTimeField('Inscrit le', auto_now_add=True)

    class Meta:
        verbose_name = 'Abonné newsletter'
        verbose_name_plural = 'Abonnés newsletter'
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email
