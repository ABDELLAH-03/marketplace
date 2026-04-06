from django.shortcuts import render

# Create your views here.
from rest_framework import generics ,viewsets
from .models import Product ,Category
from .serializers import ProductSerializer ,CategorySerializer,ProductCreateSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStoreOwner
from rest_framework.permissions import IsAdminUser


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsStoreOwner]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer  # ← pour création/modification
        return ProductSerializer  # ← pour lecture

    def get_queryset(self):
        return Product.objects.filter(store__owner=self.request.user)

    def perform_create(self, serializer):
        store_id = self.request.data.get('store_id')
        serializer.save(store_id=store_id)

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        category_id = self.request.query_params.get('category')
        store_id = self.request.query_params.get('store')
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        return queryset

class AdminProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['store', 'category', 'stock']

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer