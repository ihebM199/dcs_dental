from django.urls import path

from apps.notifications.views import NewsletterSubscribeView

app_name = 'notifications'
urlpatterns = [
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
]
