"""
Tests for the orders app.
"""
import pytest
from django.urls import reverse
from rest_framework import status

from apps.orders.models import Order
from apps.products.models import Brand, Category, Product


@pytest.fixture
def product_for_order(db):
    cat = Category.objects.create(name='Test', slug='test')
    brand = Brand.objects.create(name='TestBrand', slug='testbrand')
    return Product.objects.create(
        name='Test Product', slug='test-product',
        brand=brand, category=cat,
        price=100.000, stock=20, stock_max=50,
    )


@pytest.mark.django_db
class TestOrderCreation:
    def test_create_order(self, authenticated_client, product_for_order):
        url = reverse('orders:order-list')
        data = {
            'items': [{'product_id': product_for_order.id, 'quantity': 2}],
            'shipping_address': '123 Rue Test, Tunis',
            'shipping_phone': '+21650000000',
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['order_number'].startswith('ORD-')
        # Stock should be decremented
        product_for_order.refresh_from_db()
        assert product_for_order.stock == 18

    def test_create_order_insufficient_stock(self, authenticated_client, product_for_order):
        url = reverse('orders:order-list')
        data = {
            'items': [{'product_id': product_for_order.id, 'quantity': 999}],
            'shipping_address': '123 Rue Test',
            'shipping_phone': '+21650000000',
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_cancel_order(self, authenticated_client, product_for_order):
        # Create order first
        url = reverse('orders:order-list')
        data = {
            'items': [{'product_id': product_for_order.id, 'quantity': 2}],
            'shipping_address': '123 Rue Test',
            'shipping_phone': '+21650000000',
        }
        response = authenticated_client.post(url, data, format='json')
        order_id = response.data['id']

        # Cancel it
        cancel_url = reverse('orders:order-cancel', kwargs={'pk': order_id})
        response = authenticated_client.post(cancel_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'CANCELLED'
        # Stock should be restored
        product_for_order.refresh_from_db()
        assert product_for_order.stock == 20

    def test_list_orders_unauthenticated(self, api_client):
        url = reverse('orders:order-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
