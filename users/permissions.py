from rest_framework import permissions
from django.utils.translation import ugettext_lazy as _


class IsPartOfConnectionRequest(permissions.BasePermission):
    messages = _("Error Permission denied")

    def has_object_permission(self, request, view, obj):
        return obj.to_user == request.user or obj.from_user == request.user


class IsNotAlreadyConnected(permissions.BasePermission):
    message = _('Already in your network')

    def has_object_permission(self, request, view, obj):
        return obj.to_user not in request.user.profile.network.all()
