# apps/stores/urls.py
from django.urls import path
from .views import StoreOwnerStoreListView

urlpatterns = [
    path('my-stores/', StoreOwnerStoreListView.as_view(), name='my-stores'),
]