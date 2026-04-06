from rest_framework import permissions

class IsStoreOwner(permissions.BasePermission):
    """
    Autorise seulement le propriétaire du store à accéder/modifier ses produits
    """

    def has_object_permission(self, request, view, obj):
        # obj ici est un Product
        return obj.store.owner == request.user