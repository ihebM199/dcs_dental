"""Serializers for the promotions app."""
from rest_framework import serializers
from apps.promotions.models import PromoCode


class PromoCodeSerializer(serializers.ModelSerializer):
    is_valid = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = PromoCode
        fields = '__all__'


class PromoCodeValidateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30)

    def validate_code(self, value):
        try:
            promo = PromoCode.objects.get(code=value.upper())
        except PromoCode.DoesNotExist:
            raise serializers.ValidationError('Code promo invalide.')
        if not promo.is_valid:
            if promo.is_expired:
                raise serializers.ValidationError('Ce code promo a expiré.')
            raise serializers.ValidationError('Ce code promo n\'est plus valide.')
        return value
