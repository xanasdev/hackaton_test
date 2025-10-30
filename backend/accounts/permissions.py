from rest_framework.permissions import BasePermission

class HasRolePermission(BasePermission):
    def __init__(self, required_permission):
        self.required_permission = required_permission
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.has_permission(self.required_permission)

def require_permission(permission):
    def decorator(view_class):
        view_class.permission_classes = [HasRolePermission(permission)]
        return view_class
    return decorator

# Готовые декораторы для ролей
def admin_required(view_class):
    return require_permission('admin_access')(view_class)

def manager_required(view_class):
    return require_permission('manager_access')(view_class)

def user_required(view_class):
    return require_permission('user_access')(view_class)
