# apps/admin_dashboard/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.products.models import Product
from apps.stores.models import Store
from apps.orders.models import Order

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'store', 'stock', 'category', 'image']
        read_only_fields = ['id']

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'owner']
        read_only_fields = ['id']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'created_at']  # ← enlève 'product'