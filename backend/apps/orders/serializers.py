"""
Serializers for the orders app.
"""
from django.db import transaction
from rest_framework import serializers

from apps.orders.models import Order, OrderItem
from apps.products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    """Read serializer for order items."""

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'subtotal']


class OrderItemCreateSerializer(serializers.Serializer):
    """Input serializer for creating order items."""

    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating an order."""

    items = OrderItemCreateSerializer(many=True)
    shipping_address = serializers.CharField()
    shipping_phone = serializers.CharField(max_length=20)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    promo_code = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('La commande doit contenir au moins un article.')
        return items

    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data.pop('items')
        promo_code_str = validated_data.pop('promo_code', '')

        # Create order
        order = Order.objects.create(
            user=user,
            shipping_address=validated_data['shipping_address'],
            shipping_phone=validated_data['shipping_phone'],
            notes=validated_data.get('notes', ''),
        )

        total = 0
        for item_data in items_data:
            try:
                product = Product.objects.select_for_update().get(
                    id=item_data['product_id'], is_active=True,
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Produit {item_data['product_id']} introuvable."
                )

            qty = item_data['quantity']
            if product.stock < qty:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour {product.name}. "
                    f"Disponible: {product.stock}"
                )

            # Decrement stock
            product.stock -= qty
            product.save(update_fields=['stock'])

            # Create order item with snapshot
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_price=product.price,
                quantity=qty,
            )
            total += order_item.subtotal

        order.total_amount = total

        # Apply promo code if provided
        discount = 0
        if promo_code_str:
            from apps.promotions.models import PromoCode
            try:
                promo = PromoCode.objects.get(code=promo_code_str.upper())
                if promo.is_valid:
                    discount = total * (promo.discount_percentage / 100)
                    order.promo_code = promo
                    promo.times_used += 1
                    promo.save(update_fields=['times_used'])
            except PromoCode.DoesNotExist:
                pass

        order.discount_amount = discount
        order.final_amount = total - discount
        order.save()

        try:
            from apps.notifications.tasks import send_order_admin_notification
            from apps.notifications.utils import dispatch_after_commit
            dispatch_after_commit(send_order_admin_notification, order.id)
        except Exception:
            pass

        return order


class OrderSerializer(serializers.ModelSerializer):
    """Full order serializer with items."""

    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_email', 'user_name',
            'status', 'status_display',
            'total_amount', 'discount_amount', 'final_amount',
            'promo_code', 'shipping_address', 'shipping_phone', 'notes',
            'items', 'created_at', 'updated_at',
        ]


class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating order status (admin only)."""

    status = serializers.ChoiceField(choices=Order.Status.choices)
