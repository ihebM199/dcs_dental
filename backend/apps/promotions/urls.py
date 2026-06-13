"""URL routing for the promotions app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from apps.promotions.views import PromoCodeViewSet

app_name = 'promotions'
router = DefaultRouter()
router.register('', PromoCodeViewSet, basename='promocode')
urlpatterns = [path('', include(router.urls))]
