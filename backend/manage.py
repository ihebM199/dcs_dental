#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from config.secret_env import default_settings_module, load_secret_env


def main():
    """Run administrative tasks."""
    # Optional secret file (Render Secret Files, Docker secrets, ...).
    # Loaded before choosing the settings module so DJANGO_SETTINGS_MODULE
    # can come from the file too.
    load_secret_env()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', default_settings_module())
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
