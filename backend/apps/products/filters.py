"""
Django-filter FilterSet for products.
"""
import django_filters

from apps.products.models import Product


class ProductFilter(django_filters.FilterSet):
    """Filters for product listing matching frontend query parameters."""

    category = django_filters.CharFilter(field_name='category__slug')
    brand = django_filters.CharFilter(field_name='brand__slug')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_promo = django_filters.BooleanFilter()
    is_new = django_filters.BooleanFilter()
    is_best_seller = django_filters.BooleanFilter()

    class Meta:
        model = Product
        fields = ['category', 'brand', 'is_promo', 'is_new', 'is_best_seller']
