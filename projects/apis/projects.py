from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from projects.models import Project
from projects.serializers import ProjectSerializer


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
