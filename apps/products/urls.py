from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductListView ,ProductViewSet ,CategoryListView


router = DefaultRouter()
router.register(r'store-products', ProductViewSet, basename='store-products')

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),

]
urlpatterns += router.urls
