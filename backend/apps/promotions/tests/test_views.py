"""Tests for the promotions app."""
import pytest
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from apps.promotions.models import PromoCode


@pytest.fixture
def promo_code(db):
    return PromoCode.objects.create(
        code='DCS10', description='10% off',
        discount_percentage=10,
        expires_at=timezone.now() + timedelta(days=30),
    )


@pytest.mark.django_db
class TestPromoCodeValidation:
    def test_validate_valid_code(self, authenticated_client, promo_code):
        url = reverse('promotions:promocode-validate')
        response = authenticated_client.post(url, {'code': 'DCS10'}, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['discount_percentage'] == '10.00'

    def test_validate_invalid_code(self, authenticated_client):
        url = reverse('promotions:promocode-validate')
        response = authenticated_client.post(url, {'code': 'INVALID'}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_validate_expired_code(self, authenticated_client, db):
        PromoCode.objects.create(
            code='EXPIRED', description='Expired',
            discount_percentage=5,
            expires_at=timezone.now() - timedelta(days=1),
        )
        url = reverse('promotions:promocode-validate')
        response = authenticated_client.post(url, {'code': 'EXPIRED'}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
