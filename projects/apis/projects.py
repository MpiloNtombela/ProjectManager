from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status, filters
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from projects.models import Project
from projects.serializers import ProjectSerializer, ProjectUserSerializer, ProjectMembersSerializer
from users.models import User


class ProjectRetrieveAPI(generics.RetrieveAPIView):
    """
    apis to retrieve project
    """
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = [AllowAny]

    def get_object(self):
        return Project.objects.select_related('creator').get(id=self.kwargs['pk'])

    def retrieve(self, request, *args, **kwargs):
        """
        retrieves a single project given it id
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: project object
        """
        obj = self.get_object()
        serializer = ProjectSerializer(obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectMembersListAPI(generics.ListAPIView):
    serializer_class = ProjectUserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']

    def get_queryset(self):
        return Project.objects.get(id=self.kwargs['pk']).members


