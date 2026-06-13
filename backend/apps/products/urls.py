"""
URL routing for the products app.
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.products.views import BrandViewSet, CategoryViewSet, ProductViewSet

app_name = 'products'

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('brands', BrandViewSet, basename='brand')
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
