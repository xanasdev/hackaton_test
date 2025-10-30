# ✅ НОВЫЙ ФАЙЛ: Модели для системы ролей и пользователей
from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=list)  # список разрешений
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    def has_permission(self, permission):
        if self.role:
            return permission in self.role.permissions
        return False