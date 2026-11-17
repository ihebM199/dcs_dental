"""
Runtime bootstrap helpers.

Two responsibilities, both needed *before* Django reads its settings:

* load an optional ``.env`` secret file into ``os.environ``
  (Render Secret Files, Docker secrets, ...);
* pick the default settings module (production on a hosting platform,
  development on a developer machine).

Values already present in the process environment always win, so real
platform environment variables keep precedence over the secret file.
Override the secret file path with ``SECRETS_ENV_FILE``.
"""
import os

DEFAULT_SECRETS_ENV_FILE = '/etc/secrets/.env'
PRODUCTION_SETTINGS = 'config.settings.production'
DEVELOPMENT_SETTINGS = 'config.settings.development'

# Keys whose value was injected from the secret file (useful for diagnostics).
FILE_PROVIDED_KEYS = set()

# Set automatically by the hosting platforms below.
_PRODUCTION_MARKERS = (
    'RENDER',
    'RENDER_SERVICE_ID',
    'RAILWAY_ENVIRONMENT',
    'FLY_APP_NAME',
    'DYNO',
    'WEBSITE_SITE_NAME',
)


def load_secret_env() -> None:
    """Inject the secret file values that are not already in ``os.environ``."""
    path = os.environ.get('SECRETS_ENV_FILE', DEFAULT_SECRETS_ENV_FILE)
    if not path or not os.path.isfile(path):
        return

    from decouple import RepositoryEnv

    for key, value in RepositoryEnv(path).data.items():
        if key in os.environ:
            continue
        os.environ[key] = value
        FILE_PROVIDED_KEYS.add(key)


def source_of(key: str) -> str:
    """Human readable origin of an environment variable, without its value."""
    if key in FILE_PROVIDED_KEYS:
        return 'secret-file'
    if os.environ.get(key):
        return 'env-var'
    return 'default'


def running_on_platform() -> bool:
    """True when the process runs on a hosting platform (Render, ...)."""
    return any(os.environ.get(marker) for marker in _PRODUCTION_MARKERS)


def default_settings_module() -> str:
    """Settings module used when ``DJANGO_SETTINGS_MODULE`` is not set.

    Production is the only safe default in the cloud: the build command runs
    ``manage.py migrate`` there, and development settings would silently fall
    back to the local Docker database (``localhost:5433``).
    """
    return PRODUCTION_SETTINGS if running_on_platform() else DEVELOPMENT_SETTINGS
