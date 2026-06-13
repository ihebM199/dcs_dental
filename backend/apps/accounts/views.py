"""
Views for the accounts app.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import User
from apps.accounts.permissions import IsAdmin
from apps.accounts.serializers import (
    AdminUserSerializer,
    ChangePasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Register a new user and return JWT tokens."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Authenticate user and return JWT tokens."""

    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile."""

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UserUpdateSerializer
        return UserSerializer


class ChangePasswordView(APIView):
    """Change the current user's password."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response(
            {'detail': 'Mot de passe modifié avec succès.'},
            status=status.HTTP_200_OK,
        )


class UserListView(generics.ListAPIView):
    """List all users (admin only)."""

    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    filterset_fields = ['role', 'profession', 'is_active']
    ordering_fields = ['date_joined', 'email', 'first_name']


class DashboardStatsView(APIView):
    """Admin dashboard statistics."""

    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        from apps.orders.models import Order
        from apps.products.models import Product
        from apps.support.models import Ticket

        total_users = User.objects.count()
        total_products = Product.objects.filter(is_active=True).count()
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='PENDING').count()
        open_tickets = Ticket.objects.filter(
            status__in=['OPEN', 'IN_PROGRESS']
        ).count()

        # Revenue
        from django.db.models import Sum
        revenue = Order.objects.filter(
            status__in=['CONFIRMED', 'SHIPPING', 'DELIVERED']
        ).aggregate(total=Sum('final_amount'))['total'] or 0

        return Response({
            'total_users': total_users,
            'total_products': total_products,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'open_tickets': open_tickets,
            'total_revenue': str(revenue),
        })
