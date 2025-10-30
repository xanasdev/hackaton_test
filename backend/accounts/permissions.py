from rest_framework.permissions import BasePermission

def create_role_permission(required_permission):
    class RolePermission(BasePermission):
        def has_permission(self, request, view):
            if not request.user.is_authenticated:
                return False
            return request.user.has_permission(required_permission)
    return RolePermission

# Готовые классы разрешений
class AdminPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        elif request.user.is_superuser:
            return True
        return request.user.has_permission('admin_access')

class ManagerPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.has_permission('manager_access')

class UserPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.has_permission('user_access')

# Декораторы для классов
def admin_required(view_class):
    view_class.permission_classes = [AdminPermission]
    return view_class

def manager_required(view_class):
    view_class.permission_classes = [ManagerPermission]
    return view_class

def user_required(view_class):
    view_class.permission_classes = [UserPermission]
    return view_class
