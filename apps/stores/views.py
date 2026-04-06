from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from apps.stores.models import Store
from .Serialize import StoreSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser


class AdminStoreListView(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]

class AdminStoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]

class StoreOwnerStoreListView(generics.ListAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Store.objects.filter(owner=self.request.user)