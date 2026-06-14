"""
Helpers for dispatching notification tasks (async with sync fallback).
"""


def dispatch_task(task, *args, **kwargs):
    """Run task via Celery when available, otherwise synchronously."""
    try:
        task.delay(*args, **kwargs)
    except Exception:
        task(*args, **kwargs)
