"""
Tests for the accounts app.
"""
import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestRegistration:
    """Tests for user registration."""

    def test_register_success(self, api_client):
        url = reverse('accounts:register')
        data = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'first_name': 'Nouveau',
            'last_name': 'Utilisateur',
            'phone': '+21650000000',
            'location': 'Sfax',
            'profession': 'DENTIST',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        assert response.data['user']['email'] == 'newuser@example.com'

    def test_register_password_mismatch(self, api_client):
        url = reverse('accounts:register')
        data = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'DifferentPass!',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+21650000000',
            'location': 'Sfax',
            'profession': 'DENTIST',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self, api_client, user):
        url = reverse('accounts:register')
        data = {
            'email': user.email,
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+21650000000',
            'location': 'Sfax',
            'profession': 'DENTIST',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    """Tests for user login."""

    def test_login_success(self, api_client, user):
        url = reverse('accounts:login')
        data = {'email': user.email, 'password': 'TestPass123!'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'tokens' in response.data

    def test_login_wrong_password(self, api_client, user):
        url = reverse('accounts:login')
        data = {'email': user.email, 'password': 'WrongPass!'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestProfile:
    """Tests for user profile."""

    def test_get_profile(self, authenticated_client, user):
        url = reverse('accounts:profile')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email

    def test_update_profile(self, authenticated_client):
        url = reverse('accounts:profile')
        data = {'first_name': 'Updated', 'last_name': 'Name'}
        response = authenticated_client.patch(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK

    def test_profile_unauthenticated(self, api_client):
        url = reverse('accounts:profile')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
