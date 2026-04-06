from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model

from apps.stores.models import Store
from apps.products.models import Product
from apps.orders.models import Order
from .serializers import UserSerializer, ProductSerializer, StoreSerializer, OrderSerializer

User = get_user_model()

# --- Users ---
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

# --- Dashboard Stats ---
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users_count = User.objects.count()
        stores_count = Store.objects.count()
        products_count = Product.objects.count()
        orders_count = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()

        return Response({
            'users': users_count,
            'stores': stores_count,
            'products': products_count,
            'orders': orders_count,
            'pending_orders': pending_orders
        })

# --- Stores ---
class AdminStoreListView(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]

class AdminStoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]

# --- Products ---
class AdminProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

# --- Orders ---
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

class AdminOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]