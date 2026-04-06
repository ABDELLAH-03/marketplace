# apps/admin_dashboard/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model

from apps.stores.models import Store
from apps.products.models import Product, Category
from apps.orders.models import Order
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    StoreSerializer,
    ProductSerializer, CategorySerializer,
    OrderSerializer,
)

User = get_user_model()


# ── Dashboard Stats ──────────────────────────────────────────────────────────
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'users': User.objects.count(),
            'stores': Store.objects.count(),
            'products': Product.objects.count(),
            'orders': Order.objects.count(),
            'pending_orders': Order.objects.filter(status='PAID').count(),
        })


# ── Users ────────────────────────────────────────────────────────────────────
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class AdminUserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [IsAdminUser]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer


# ── Stores ───────────────────────────────────────────────────────────────────
class AdminStoreListView(generics.ListAPIView):
    queryset = Store.objects.select_related('owner').all().order_by('-created_at')
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]


class AdminStoreCreateView(generics.CreateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]


class AdminStoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.select_related('owner').all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]


# ── Products ─────────────────────────────────────────────────────────────────
class AdminProductListView(generics.ListAPIView):
    queryset = Product.objects.select_related('store', 'category').all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class AdminProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('store', 'category').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminCategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]


# ── Orders ───────────────────────────────────────────────────────────────────
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.select_related('user').prefetch_related('items__product').all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.select_related('user').prefetch_related('items__product').all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')
        valid = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid:
            return Response({'error': f'Statut invalide. Valeurs acceptées: {valid}'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save()
        return Response(self.get_serializer(order).data)