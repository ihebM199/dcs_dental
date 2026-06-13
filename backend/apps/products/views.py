"""
Views for the products app.
"""
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from apps.accounts.permissions import IsAdmin
from apps.products.filters import ProductFilter
from apps.products.models import Brand, Category, Product, ProductImage
from apps.products.serializers import (
    BrandSerializer,
    CategorySerializer,
    ProductCreateUpdateSerializer,
    ProductFullSerializer,
    ProductImageSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """CRUD for product categories."""

    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdmin()]


class BrandViewSet(viewsets.ModelViewSet):
    """CRUD for product brands."""

    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdmin()]


class ProductViewSet(viewsets.ModelViewSet):
    """CRUD for products with filtering, search, and slug-based lookup."""

    queryset = Product.objects.filter(is_active=True).select_related('brand', 'category')
    lookup_field = 'slug'
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand__name']
    ordering_fields = ['price', 'created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductFullSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ProductCreateUpdateSerializer
        return ProductListSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdmin()]

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, slug=None):
        """Upload an image for a product."""
        product = self.get_object()
        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='delete-image/(?P<image_id>[0-9]+)')
    def delete_image(self, request, slug=None, image_id=None):
        """Delete a product image."""
        product = self.get_object()
        try:
            image = product.images.get(id=image_id)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response(
                {'detail': 'Image non trouvée.'},
                status=status.HTTP_404_NOT_FOUND,
            )
