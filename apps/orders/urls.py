from django.urls import path
from .views import CartItemCreateView, CartItemListView, OrderCreateView,EmballageOrderListView ,EmballageOrderUpdateView ,DeliveryOrderListView ,DeliveryOrderUpdateView ,MyOrdersListView ,CartItemDetailView , DeliveryHistoryView ,EmballageHistoryView

urlpatterns = [
    path('cart/add/', CartItemCreateView.as_view(), name='cart-add'),
    path('cart/', CartItemListView.as_view(), name='cart-list'),
    path('order/confirm/', OrderCreateView.as_view(), name='order-confirm'),
    path('orders/my/', MyOrdersListView.as_view(), name='my-orders'),
    path('cart/<int:pk>/', CartItemDetailView.as_view(), name='cart-detail'),

    # Emballage
    path('orders/emballage/', EmballageOrderListView.as_view(), name='emballage-orders'),
    path('orders/emballage/<int:pk>/ready/', EmballageOrderUpdateView.as_view(), name='emballage-order-ready'),
     path('orders/emballage/history/', EmballageHistoryView.as_view(), name='emballage-history'),


    # Delivery
    path('orders/delivery/', DeliveryOrderListView.as_view(), name='delivery-orders'),
    path('orders/delivery/<int:pk>/delivered/', DeliveryOrderUpdateView.as_view(), name='delivery-order-delivered'),
    path('orders/delivery/history/', DeliveryHistoryView.as_view(), name='delivery-history'),

]