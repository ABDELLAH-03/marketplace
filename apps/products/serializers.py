from rest_framework import serializers
from .models import Product, Category
from apps.stores.models import Store

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'store', 'category', 'image']

class ProductCreateSerializer(serializers.ModelSerializer):
    store_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'store_id', 'category', 'image']

    def create(self, validated_data):
        store_id = validated_data.pop('store_id')
        product = Product.objects.create(store_id=store_id, **validated_data)
        return product

    def update(self, instance, validated_data):
        validated_data.pop('store_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance