"""Views for the promotions app."""
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsAdmin
from apps.promotions.models import PromoCode
from apps.promotions.serializers import PromoCodeSerializer, PromoCodeValidateSerializer


class PromoCodeViewSet(viewsets.ModelViewSet):
    queryset = PromoCode.objects.all()
    serializer_class = PromoCodeSerializer

    def get_permissions(self):
        if self.action == 'validate':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdmin()]

    @action(detail=False, methods=['post'])
    def validate(self, request):
        """Validate a promo code and return discount info."""
        serializer = PromoCodeValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        promo = PromoCode.objects.get(code=serializer.validated_data['code'].upper())
        return Response({
            'code': promo.code,
            'description': promo.description,
            'discount_percentage': str(promo.discount_percentage),
            'is_valid': promo.is_valid,
        })
