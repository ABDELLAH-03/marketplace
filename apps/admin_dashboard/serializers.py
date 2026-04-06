# apps/admin_dashboard/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from apps.products.models import Product, Category
from apps.stores.models import Store
from apps.orders.models import Order, OrderItem

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'is_active', 'balance', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'password', 'password2', 'is_active']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'NORMAL_USER'),
            is_active=validated_data.get('is_active', True),
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'is_active', 'balance', 'password']
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# Stores
class StoreOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class StoreSerializer(serializers.ModelSerializer):
    owner_detail = StoreOwnerSerializer(source='owner', read_only=True)
    owner = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='STORE_OWNER')
    )

    class Meta:
        model = Store
        fields = ['id', 'name', 'description', 'owner', 'owner_detail', 'created_at']
        read_only_fields = ['id', 'created_at']


# Products
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    store_detail = ProductStoreSerializer(source='store', read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)
    store = serializers.PrimaryKeyRelatedField(queryset=Store.objects.all())
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'stock',
            'store', 'store_detail',
            'category', 'category_detail',
            'image', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# Orders
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'price']


class OrderUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_detail = OrderUserSerializer(source='user', read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_detail',
            'items', 'items_count',
            'total_amount', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'total_amount', 'created_at', 'items']

    def get_items_count(self, obj):
        return obj.items.count()