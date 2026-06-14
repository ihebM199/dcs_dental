"""
Django development settings for DCS Dental project.
"""
from .base import *  # noqa: F401,F403

DEBUG = True
ALLOWED_HOSTS = ['*']

# CORS - allow all in development
CORS_ALLOW_ALL_ORIGINS = True
REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = []
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {}
