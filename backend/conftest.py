"""
Shared test fixtures for the DCS Dental project.
"""
import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    """Return an unauthenticated API client."""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Factory fixture to create users."""
    from apps.accounts.models import User

    def _create_user(**kwargs):
        defaults = {
            'email': 'testuser@example.com',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+21600000000',
            'location': 'Tunis',
            'profession': 'DENTIST',
        }
        defaults.update(kwargs)
        password = defaults.pop('password')
        user = User.objects.create_user(password=password, **defaults)
        return user

    return _create_user


@pytest.fixture
def user(create_user):
    """Return a standard user."""
    return create_user()


@pytest.fixture
def admin_user(create_user):
    """Return an admin user."""
    return create_user(
        email='admin@example.com',
        role='ADMIN',
        first_name='Admin',
        last_name='User',
    )


@pytest.fixture
def super_admin_user(create_user):
    """Return a super admin user."""
    return create_user(
        email='superadmin@example.com',
        role='SUPER_ADMIN',
        first_name='Super',
        last_name='Admin',
        is_superuser=True,
        is_staff=True,
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Return an API client authenticated as a regular user."""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Return an API client authenticated as an admin."""
    api_client.force_authenticate(user=admin_user)
    return api_client
