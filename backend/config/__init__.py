"""Celery app initialization for DCS Dental."""
from .secret_env import load_secret_env

# Load the optional secret file before anything reads DJANGO_SETTINGS_MODULE.
load_secret_env()

from .celery import app as celery_app  # noqa: E402

__all__ = ('celery_app',)
