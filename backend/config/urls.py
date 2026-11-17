"""
URL configuration for DCS Dental project.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.views.decorators.http import require_safe
from django.views.static import serve as media_serve
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


@require_safe
def health(request):
    """Root/health endpoint so uptime checks and Health Checks get a 200."""
    return JsonResponse(
        {
            'status': 'ok',
            'service': 'dcs-dental-backend',
            'docs': request.build_absolute_uri('/api/docs/'),
            'admin': request.build_absolute_uri('/admin/'),
        }
    )


urlpatterns = [
    # Health check (Render pings "/" and treats 4xx/5xx as a failure)
    path('', health, name='health'),
    path('healthz/', health, name='healthz'),

    # Django admin
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/promotions/', include('apps.promotions.urls')),
    path('api/v1/inventory/', include('apps.inventory.urls')),
    path('api/v1/invoices/', include('apps.invoices.urls')),
    path('api/v1/delivery/', include('apps.delivery.urls')),
    path('api/v1/reviews/', include('apps.reviews.urls')),
    path('api/v1/support/', include('apps.support.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),

    # API Documentation (Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # Render has no separate web server for media: serve uploads from Django.
    urlpatterns += [
        re_path(
            r'^media/(?P<path>.*)$',
            media_serve,
            {'document_root': settings.MEDIA_ROOT},
        ),
    ]
