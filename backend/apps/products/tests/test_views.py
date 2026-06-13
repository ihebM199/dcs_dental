"""
Tests for the products app.
"""
import pytest
from django.urls import reverse
from rest_framework import status

from apps.products.models import Brand, Category, Product


@pytest.fixture
def category(db):
    return Category.objects.create(name='Instruments', slug='instruments')


@pytest.fixture
def brand(db):
    return Brand.objects.create(name='DentaPro', slug='dentapro')


@pytest.fixture
def product(db, category, brand):
    return Product.objects.create(
        name='Micromoteur électrique',
        slug='micromoteur-electrique',
        brand=brand,
        category=category,
        price=1290.000,
        stock=10,
        stock_max=40,
    )


@pytest.mark.django_db
class TestCategoryAPI:
    def test_list_categories(self, api_client, category):
        url = reverse('products:category-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_create_category_admin_only(self, api_client):
        url = reverse('products:category-list')
        data = {'name': 'Test', 'slug': 'test'}
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestProductAPI:
    def test_list_products(self, api_client, product):
        url = reverse('products:product-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_retrieve_product_by_slug(self, api_client, product):
        url = reverse('products:product-detail', kwargs={'slug': product.slug})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == product.name

    def test_filter_by_category(self, api_client, product):
        url = reverse('products:product-list')
        response = api_client.get(url, {'category': 'instruments'})
        assert response.status_code == status.HTTP_200_OK

    def test_search_products(self, api_client, product):
        url = reverse('products:product-list')
        response = api_client.get(url, {'search': 'micromoteur'})
        assert response.status_code == status.HTTP_200_OK

    def test_create_product_admin_only(self, api_client):
        url = reverse('products:product-list')
        response = api_client.post(url, {'name': 'Test'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_stock_level_low(self, product):
        product.stock = 5
        product.stock_max = 40
        assert product.stock_level == 'low'

    def test_stock_level_high(self, product):
        product.stock = 35
        product.stock_max = 40
        assert product.stock_level == 'high'
