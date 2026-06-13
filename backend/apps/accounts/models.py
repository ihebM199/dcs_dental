"""
Custom User model for DCS Dental.
Supports email-based authentication with role management and dental profession tracking.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom manager for email-based user creation."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError("L'adresse email est obligatoire.")
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)
        extra_fields.setdefault('phone', '+21600000000')
        extra_fields.setdefault('location', 'Tunis')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom user model using email as the primary identifier."""

    class Role(models.TextChoices):
        USER = 'USER', 'Utilisateur'
        ADMIN = 'ADMIN', 'Administrateur'
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Administrateur'

    class Profession(models.TextChoices):
        DENTIST = 'DENTIST', 'Dentiste'
        DENTAL_PROSTHETIST = 'DENTAL_PROSTHETIST', 'Prothésiste dentaire'
        PROSTHESIS_STUDENT = 'PROSTHESIS_STUDENT', 'Étudiant en prothèse dentaire'
        DENTAL_MEDICINE_STUDENT = 'DENTAL_MEDICINE_STUDENT', 'Étudiant en médecine dentaire'

    # Remove username field, use email instead
    username = None
    email = models.EmailField('Adresse email', unique=True)

    phone = models.CharField('Téléphone', max_length=20)
    location = models.CharField('Localisation', max_length=255)
    profession = models.CharField(
        'Profession',
        max_length=30,
        choices=Profession.choices,
        default=Profession.DENTIST,
    )
    role = models.CharField(
        'Rôle',
        max_length=15,
        choices=Role.choices,
        default=Role.USER,
    )
    avatar = models.ImageField(
        'Avatar',
        upload_to='avatars/',
        blank=True,
        null=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Return the user's full name."""
        return f'{self.first_name} {self.last_name}'.strip() or self.email

    @property
    def is_admin(self):
        """Check if the user has admin role."""
        return self.role in (self.Role.ADMIN, self.Role.SUPER_ADMIN)

    @property
    def is_super_admin(self):
        """Check if the user has super admin role."""
        return self.role == self.Role.SUPER_ADMIN
