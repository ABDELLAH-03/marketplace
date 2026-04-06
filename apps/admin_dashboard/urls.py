from django.urls import path
from .views import (
    AdminUserListView,
    AdminUserDetailView,
    AdminDashboardStatsView,
    AdminStoreListView,
    AdminStoreDetailView,
    AdminProductListView,
    AdminProductDetailView,
    AdminOrderListView,
    AdminOrderDetailView
)

urlpatterns = [
    # --- Dashboard Stats ---
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),

    # --- Users ---
    path('users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),

    # --- Stores ---
    path('stores/', AdminStoreListView.as_view(), name='admin-store-list'),
    path('stores/<int:pk>/', AdminStoreDetailView.as_view(), name='admin-store-detail'),

    # --- Products ---
    path('products/', AdminProductListView.as_view(), name='admin-product-list'),
    path('products/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),

    # --- Orders ---
    path('orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('orders/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
]