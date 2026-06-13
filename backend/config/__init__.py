"""Celery app initialization for DCS Dental."""
from .celery import app as celery_app

__all__ = ('celery_app',)
