"""
ASGI config for DCS Dental project.
"""
import os

from django.core.asgi import get_asgi_application

from config.secret_env import load_secret_env

load_secret_env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_asgi_application()
