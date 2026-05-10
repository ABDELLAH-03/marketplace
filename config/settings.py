"""
Django settings for config project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS").split(",")

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'storages',          # ← added

    'apps.users',
    'apps.stores',
    'apps.products',
    'apps.cart',
    'apps.orders',
    'apps.payments',
    'apps.delivery',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ── Static files (unchanged) ──────────────────────────────────────────────────
STATIC_URL = 'static/'

# ── Media / File Storage → Supabase Storage (S3-compatible) ──────────────────
AWS_ACCESS_KEY_ID       = os.getenv('SUPABASE_S3_ACCESS_KEY')
AWS_SECRET_ACCESS_KEY   = os.getenv('SUPABASE_S3_SECRET_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('SUPABASE_BUCKET_NAME')        # e.g. "marketplace"
AWS_S3_ENDPOINT_URL     = os.getenv('SUPABASE_S3_ENDPOINT')        # see .env example below
AWS_S3_REGION_NAME      = os.getenv('SUPABASE_S3_REGION', 'eu-central-1')

AWS_S3_FILE_OVERWRITE        = False   # never silently overwrite an existing file
AWS_DEFAULT_ACL              = 'public-read'   # images must be publicly readable
AWS_S3_SIGNATURE_VERSION     = 's3v4'
AWS_QUERYSTRING_AUTH         = False   # clean URLs (no expiry tokens in image URLs)
AWS_S3_CUSTOM_DOMAIN = f"{os.getenv('SUPABASE_PROJECT_REF')}.supabase.co/storage/v1/object/public/{os.getenv('SUPABASE_BUCKET_NAME')}"
STORAGES = {
    # Media files → Supabase Storage
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
    },
    # Static files → local (unchanged)
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# Public base URL for media files served from Supabase CDN
# Format: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/
MEDIA_URL = f"https://{os.getenv('SUPABASE_PROJECT_REF')}.supabase.co/storage/v1/object/public/{os.getenv('SUPABASE_BUCKET_NAME')}/"

# ── Auth & DRF ────────────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
