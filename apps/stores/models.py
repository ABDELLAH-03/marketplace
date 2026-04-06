from django.db import models
from apps.users.models import User

class Store(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name