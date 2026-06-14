"""
Helpers for dispatching notification tasks without blocking HTTP requests.
"""
import logging
import threading

logger = logging.getLogger(__name__)


def _celery_available():
    """Quick check — avoid long broker timeouts during API requests."""
    try:
        from django.conf import settings
        import redis

        client = redis.from_url(
            settings.CELERY_BROKER_URL,
            socket_connect_timeout=1,
            socket_timeout=1,
        )
        client.ping()
        return True
    except Exception:
        return False


def _run_in_background(func, *args, **kwargs):
    """Execute a callable in a daemon thread (non-blocking)."""

    def wrapper():
        try:
            func(*args, **kwargs)
        except Exception:
            logger.exception('Échec notification en arrière-plan')
        finally:
            from django.db import connection
            connection.close()

    thread = threading.Thread(target=wrapper, daemon=True)
    thread.start()


def dispatch_task(task, *args, **kwargs):
    """
    Queue via Celery when Redis is reachable.
    Otherwise run in a background thread — API responds immediately.
    """
    if _celery_available():
        try:
            task.delay(*args, **kwargs)
            return
        except Exception:
            logger.warning('Celery indisponible, envoi email en thread.', exc_info=True)

    _run_in_background(task, *args, **kwargs)


def dispatch_after_commit(task, *args, **kwargs):
    """Dispatch only after the DB transaction commits successfully."""
    from django.db import transaction

    transaction.on_commit(lambda: dispatch_task(task, *args, **kwargs))
