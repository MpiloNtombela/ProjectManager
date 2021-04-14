from rest_framework import generics
from rest_framework.generics import GenericAPIView, get_object_or_404

from projects.models import Project
from projects.permissions import IsPartOfProject
from projects.serializers import ProjectSerializer


class CheckProjectPermissionMixin(GenericAPIView):
    queryset = Project.objects.select_related('creator')
    permission_classes = [IsPartOfProject]

    def get_object(self):
        obj = get_object_or_404(Project.objects.select_related('creator'), kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj