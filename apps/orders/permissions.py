from rest_framework import permissions

class IsEmballageUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'PACKER'  

class IsDeliveryUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'DELIVERY'  