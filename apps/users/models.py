from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models



class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, name, password=None, **extra_fields):
        """
        Crée et sauvegarde un User avec email et password
        """
        if not email:
            raise ValueError("L’email doit être fourni")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """
        Crée un superuser
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, name, password, **extra_fields)
class User(AbstractUser):

    ROLE_CHOICES = (
        ('SUPER_ADMIN', 'Super Admin'),
        ('STORE_OWNER', 'Store Owner'),
        ('NORMAL_USER', 'Normal User'),
        ('PACKER', 'Emballing User'),
        ('DELIVERY', 'Delivery User'),
    )

    username = None  # on supprime username
    email = models.EmailField(unique=True)

    name = models.CharField(max_length=150)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='NORMAL_USER'
    )

    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()  # <-- ici on ajoute le manager personnalisé


    def __str__(self):
        return self.email