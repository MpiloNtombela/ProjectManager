from django.utils.translation import ugettext_lazy as _
from rest_framework import permissions


class IsPartOfProject(permissions.BasePermission):
    """
    checks if user is part of the project
    """
    messages = _("Permission denied, you're not part of the project")

    def has_object_permission(self, request, view, obj):
        return obj.has_user(request.user)


class IsCreator(permissions.BasePermission):
    """
    checks and restrict permission to only creator of the object or the project admin(s)
    """
    messages = _("You don't have permission to perform the action")

    def has_object_permission(self, request, view, obj):
        return request.user == obj.creator


class IsProjectCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.project.creator
