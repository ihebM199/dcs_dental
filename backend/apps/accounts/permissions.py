"""
Custom permission classes for DCS Dental.
"""
from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allows access only to admin or super admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_admin
        )


class IsSuperAdmin(BasePermission):
    """Allows access only to super admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_super_admin
        )


class IsOwnerOrAdmin(BasePermission):
    """Allows access to the object owner or admin users."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        # Check common owner field names
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        return False
