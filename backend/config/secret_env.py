"""
Load an optional ``.env`` secret file into ``os.environ``.

Render can mount a Secret File (for example ``/etc/secrets/.env``). Values that
already exist in the process environment always win, so real platform
environment variables keep precedence over the file.

Override the path with ``SECRETS_ENV_FILE``.
"""
import os

DEFAULT_SECRETS_ENV_FILE = '/etc/secrets/.env'


def load_secret_env() -> None:
    """Inject the secret file values that are not already in ``os.environ``."""
    path = os.environ.get('SECRETS_ENV_FILE', DEFAULT_SECRETS_ENV_FILE)
    if not path or not os.path.isfile(path):
        return

    from decouple import RepositoryEnv

    for key, value in RepositoryEnv(path).data.items():
        os.environ.setdefault(key, value)
