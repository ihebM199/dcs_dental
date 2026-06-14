"""Views for the notifications app."""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.serializers import NewsletterSubscribeSerializer


class NewsletterSubscribeView(APIView):
    """Public endpoint for newsletter subscription."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': 'Inscription à la newsletter confirmée.'},
            status=status.HTTP_201_CREATED,
        )
