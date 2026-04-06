# apps/admin_dashboard/urls.py
from django.urls import path
from .views import (
    AdminDashboardStatsView,
    AdminUserListView, AdminUserCreateView, AdminUserDetailView,
    AdminStoreListView, AdminStoreCreateView, AdminStoreDetailView,
    AdminProductListView, AdminProductCreateView, AdminProductDetailView, AdminCategoryListView,
    AdminOrderListView, AdminOrderDetailView,
)

urlpatterns = [
    # Stats
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),

    # Users
    path('users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('users/create/', AdminUserCreateView.as_view(), name='admin-user-create'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),

    # Stores
    path('stores/', AdminStoreListView.as_view(), name='admin-store-list'),
    path('stores/create/', AdminStoreCreateView.as_view(), name='admin-store-create'),
    path('stores/<int:pk>/', AdminStoreDetailView.as_view(), name='admin-store-detail'),

    # Products
    path('products/', AdminProductListView.as_view(), name='admin-product-list'),
    path('products/create/', AdminProductCreateView.as_view(), name='admin-product-create'),
    path('products/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('categories/', AdminCategoryListView.as_view(), name='admin-category-list'),

    # Orders
    path('orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('orders/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
]