"""
WSGI config for DCS Dental project.
"""
import os

from django.core.wsgi import get_wsgi_application

from config.secret_env import default_settings_module, load_secret_env

load_secret_env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', default_settings_module())

application = get_wsgi_application()
