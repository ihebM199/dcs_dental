"""
Models for the products app.
Matches frontend data structures: Product, Category, Brand, ProductImage, ProductDetail.
"""
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Product category (e.g. Instruments, Consommables, Prothèse)."""

    name = models.CharField('Nom', max_length=100)
    slug = models.SlugField('Slug', unique=True, max_length=120)
    description = models.TextField('Description', blank=True)
    image = models.ImageField('Image', upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField('Actif', default=True)
    created_at = models.DateTimeField('Créé le', auto_now_add=True)
    updated_at = models.DateTimeField('Modifié le', auto_now=True)

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Brand(models.Model):
    """Product brand (e.g. DentaPro, MediTech)."""

    name = models.CharField('Nom', max_length=100)
    slug = models.SlugField('Slug', unique=True, max_length=120)
    logo = models.ImageField('Logo', upload_to='brands/', blank=True, null=True)
    is_active = models.BooleanField('Actif', default=True)
    created_at = models.DateTimeField('Créé le', auto_now_add=True)

    class Meta:
        verbose_name = 'Marque'
        verbose_name_plural = 'Marques'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """
    Product model matching the frontend Product interface.
    Supports price in TND (Tunisian Dinar, 3 decimal places).
    """

    name = models.CharField('Nom', max_length=255)
    slug = models.SlugField('Slug', unique=True, max_length=280)
    brand = models.ForeignKey(
        Brand, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='products', verbose_name='Marque',
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='products', verbose_name='Catégorie',
    )
    price = models.DecimalField('Prix (TND)', max_digits=10, decimal_places=3)
    old_price = models.DecimalField(
        'Ancien prix', max_digits=10, decimal_places=3, blank=True, null=True,
    )
    description = models.TextField('Description', blank=True)
    stock = models.PositiveIntegerField('Stock actuel', default=0)
    stock_max = models.PositiveIntegerField('Stock maximum', default=100)
    is_new = models.BooleanField('Nouveau', default=False)
    is_promo = models.BooleanField('En promotion', default=False)
    is_best_seller = models.BooleanField('Meilleure vente', default=False)
    is_active = models.BooleanField('Actif', default=True)
    created_at = models.DateTimeField('Créé le', auto_now_add=True)
    updated_at = models.DateTimeField('Modifié le', auto_now=True)

    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def rating(self):
        """Average rating from reviews."""
        from django.db.models import Avg
        avg = self.reviews.aggregate(avg=Avg('rating'))['avg']
        return round(avg, 1) if avg else 0

    @property
    def review_count(self):
        """Total number of approved reviews."""
        return self.reviews.filter(is_approved=True).count()

    @property
    def stock_level(self):
        """Stock level: low / medium / high (matches frontend logic)."""
        if self.stock_max == 0:
            return 'low'
        ratio = self.stock / self.stock_max
        if ratio <= 0.25:
            return 'low'
        if ratio <= 0.6:
            return 'medium'
        return 'high'

    @property
    def discount_percentage(self):
        """Calculate discount percentage from old_price."""
        if self.old_price and self.old_price > 0:
            return round((1 - float(self.price) / float(self.old_price)) * 100)
        return 0

    @property
    def primary_image(self):
        """Return the primary image URL or first image."""
        img = self.images.filter(is_primary=True).first()
        if not img:
            img = self.images.first()
        return img.image.url if img else None


class ProductImage(models.Model):
    """Product images with ordering support."""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images',
        verbose_name='Produit',
    )
    image = models.ImageField('Image', upload_to='products/')
    alt_text = models.CharField('Texte alternatif', max_length=255, blank=True)
    is_primary = models.BooleanField('Image principale', default=False)
    order = models.PositiveIntegerField('Ordre', default=0)

    class Meta:
        verbose_name = 'Image produit'
        verbose_name_plural = 'Images produit'
        ordering = ['order']

    def __str__(self):
        return f'{self.product.name} - Image {self.order}'


class ProductDetail(models.Model):
    """Product detail key-value pairs (label/value as in frontend)."""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='details',
        verbose_name='Produit',
    )
    label = models.CharField('Libellé', max_length=100)
    value = models.CharField('Valeur', max_length=255)

    class Meta:
        verbose_name = 'Détail produit'
        verbose_name_plural = 'Détails produit'

    def __str__(self):
        return f'{self.label}: {self.value}'
