"""
Views for the orders app.
"""
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsAdmin, IsOwnerOrAdmin
from apps.orders.models import Order
from apps.orders.serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
)


class OrderViewSet(viewsets.ModelViewSet):
    """Order management: create, list, retrieve, cancel, update status."""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch']

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=user).prefetch_related('items')

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action == 'update_status':
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order (only if PENDING)."""
        order = self.get_object()
        if order.user != request.user and not request.user.is_admin:
            return Response(
                {'detail': 'Non autorisé.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        if order.status != Order.Status.PENDING:
            return Response(
                {'detail': 'Seules les commandes en attente peuvent être annulées.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Restore stock
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save(update_fields=['stock'])

        order.status = Order.Status.CANCELLED
        order.save(update_fields=['status'])
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, IsAdmin])
    def update_status(self, request, pk=None):
        """Update order status (admin only)."""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = order.status
        order.status = serializer.validated_data['status']
        order.save(update_fields=['status'])

        # Generate invoice and delivery note on confirmation
        if old_status != Order.Status.CONFIRMED and order.status == Order.Status.CONFIRMED:
            from apps.invoices.utils import generate_invoice_for_order
            from apps.delivery.utils import generate_delivery_note_for_order
            generate_invoice_for_order(order)
            generate_delivery_note_for_order(order)

        return Response(OrderSerializer(order).data)
