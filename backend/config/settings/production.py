"""
Django production settings for DCS Dental project.
"""
from .base import *  # noqa: F401,F403

from decouple import Csv, config
from django.core.exceptions import ImproperlyConfigured

DEBUG = False

# -----------------------------------------------------------------------------
# Fail fast on a configuration that cannot work in production.
# A cryptic "connection refused" on localhost in the build log is far more
# expensive than an explicit startup error.
# -----------------------------------------------------------------------------
if SECRET_KEY == 'django-insecure-dev-key':  # noqa: F405
    # Warning only: the build step (migrate) does not need the key, and blocking
    # the deploy here would be more confusing than useful.
    print(
        '[dcs_dental] WARNING: DJANGO_SECRET_KEY is the insecure development '
        'default. Set a long random value in production.'
    )

_LOCAL_DB_HOSTS = {'', 'db', 'localhost', '127.0.0.1', '0.0.0.0', '::1'}
if not DATABASE_URL and config('DB_HOST', default='db') in _LOCAL_DB_HOSTS:  # noqa: F405
    raise ImproperlyConfigured(
        'No production database configured: DATABASE_URL is missing and '
        'DB_HOST points to a local/container host ({!r}). Set DATABASE_URL to '
        'the Neon (or other hosted) connection string.'.format(
            config('DB_HOST', default='db')
        )
    )

# Render terminates TLS in front of the app
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default='https://dcs-dental-backend.onrender.com',
    cast=Csv(),
)

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# CORS - restrict in production
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,https://dcs-store.tn',
    cast=Csv(),
)
