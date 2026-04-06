# apps/users/serializers_jwt.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Ajouter les champs custom dans le payload JWT
        token['role'] = user.role
        token['name'] = user.name
        token['email'] = user.email
        return token