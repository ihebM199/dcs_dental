"""Celery app initialization for DCS Dental."""
import os

from .secret_env import default_settings_module, load_secret_env

# The secret file must be loaded, and the settings module chosen, before
# anything else reads DJANGO_SETTINGS_MODULE (Celery included).
load_secret_env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', default_settings_module())

from .celery import app as celery_app  # noqa: E402

__all__ = ('celery_app',)
