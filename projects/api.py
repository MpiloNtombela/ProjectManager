from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from projects.models import Project, Task, Board
from projects.permissions import IsPartOfProject
from projects.serializers import ProjectSerializer, TaskSerializer, BoardSerializer, TaskDetailsSerializer


class ProjectRetrieveAPI(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = ProjectSerializer(obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectBoardsListCreateAPI(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    queryset = Board.objects.select_related('project').all()

    permission_classes = [IsAuthenticated, IsPartOfProject]

    def list(self, request, *args, **kwargs):
        data = {}
        try:
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        qs = Board.objects.select_related('project').filter(project=project)
        serializer = BoardSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new instance of the board model
        :param request:
        :param args:
        :param kwargs:
        :return api response:
        """
        data = {}
        try:
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("sorry, we encountered an error saving the board")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(creator=request.user, project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class BoardDestroyAPI(generics.DestroyAPIView):
    serializer_class = BoardSerializer
    queryset = Board.objects.select_related('project').all()
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        data = {}
        try:
            inst = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("board may already have been deleted")
            return Response(status=status.HTTP_404_NOT_FOUND)
        self.perform_destroy(instance=inst)
        data['message'] = _('board deleted successfully')
        return Response(data=data, status=status.HTTP_204_NO_CONTENT)


class ProjectTasksListAPI(generics.ListAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        data = {}
        try:
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        qs = Task.objects.select_related('project').filter(project=project)
        serializer = TaskSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class TaskDetailsAPI(generics.RetrieveAPIView):
    """retrieves all the details of the task"""
    serializer_class = TaskDetailsSerializer
    queryset = Task.objects.all()
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = TaskDetailsSerializer(obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
