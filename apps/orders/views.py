from django.shortcuts import render

from rest_framework import generics, permissions
from .models import CartItem, Order ,OrderItem
from .serializers import CartItemSerializer, OrderSerializer
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsEmballageUser, IsDeliveryUser 
from rest_framework.permissions import IsAdminUser


# EmballageUser : voir commandes payées et passer READY_TO_DELIVER
class EmballageOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmballageUser]

    def get_queryset(self):
        return Order.objects.filter(status='PAID')

class EmballageOrderUpdateView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmballageUser]
    queryset = Order.objects.filter(status='PAID')

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        order.status = 'READY_TO_DELIVER'
        order.save()
        return Response(self.get_serializer(order).data, status=status.HTTP_200_OK)

# DeliveryUser : voir commandes prêtes et passer DELIVERED
class DeliveryOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryUser]

    def get_queryset(self):
        return Order.objects.filter(status='READY_TO_DELIVER')

class DeliveryOrderUpdateView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryUser]
    queryset = Order.objects.filter(status='READY_TO_DELIVER')

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        order.status = 'DELIVERED'
        order.save()
        return Response(self.get_serializer(order).data, status=status.HTTP_200_OK)
# Ajouter au panier
class CartItemCreateView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Liste du panier
class CartItemListView(generics.ListAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

# Confirmer la commande
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Panier vide"}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.product.price * item.quantity for item in cart_items)
        order = Order.objects.create(user=request.user, total_amount=total)

        # ← Créer les OrderItems AVANT de supprimer le panier
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            item.product.stock -= item.quantity
            item.product.save()

        cart_items.delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['store', 'user', 'status']

class MyOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    
# Historique commandes emballées (READY_TO_DELIVER + DELIVERED)
class EmballageHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmballageUser]

    def get_queryset(self):
        return Order.objects.filter(
            status__in=['READY_TO_DELIVER', 'DELIVERED']
        ).order_by('-created_at')

# Historique commandes livrées (DELIVERED)
class DeliveryHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryUser]

    def get_queryset(self):
        return Order.objects.filter(
            status='DELIVERED'
        ).order_by('-created_at')