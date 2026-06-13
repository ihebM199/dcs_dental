"""
Serializers for the products app.
"""
from rest_framework import serializers

from apps.products.models import Brand, Category, Product, ProductDetail, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer with product count."""

    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class BrandSerializer(serializers.ModelSerializer):
    """Brand serializer."""

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'is_active']


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer."""

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductDetailSerializer(serializers.ModelSerializer):
    """Product detail key-value serializer."""

    class Meta:
        model = ProductDetail
        fields = ['id', 'label', 'value']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight product serializer for list views (matches frontend ProductCard)."""

    brand = serializers.StringRelatedField()
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    category_slug = serializers.CharField(source='category.slug', read_only=True, default='')
    rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    stock_level = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    primary_image = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'category_name', 'category_slug',
            'price', 'old_price', 'rating', 'review_count',
            'stock', 'stock_max', 'stock_level', 'primary_image',
            'is_new', 'is_promo', 'is_best_seller', 'discount_percentage',
        ]


class ProductFullSerializer(serializers.ModelSerializer):
    """Full product serializer for detail view."""

    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    details = ProductDetailSerializer(many=True, read_only=True)
    rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    stock_level = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    related_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'category',
            'price', 'old_price', 'description',
            'stock', 'stock_max', 'stock_level',
            'is_new', 'is_promo', 'is_best_seller', 'is_active',
            'rating', 'review_count', 'discount_percentage',
            'images', 'details', 'related_products',
            'created_at', 'updated_at',
        ]

    def get_related_products(self, obj):
        related = Product.objects.filter(
            category=obj.category, is_active=True,
        ).exclude(id=obj.id)[:4]
        return ProductListSerializer(related, many=True, context=self.context).data


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Admin serializer for creating/updating products."""

    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'brand', 'category',
            'price', 'old_price', 'description',
            'stock', 'stock_max',
            'is_new', 'is_promo', 'is_best_seller', 'is_active',
        ]
