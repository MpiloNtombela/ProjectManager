from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status
from rest_framework import pagination
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from projects.models import Project, Task, Board
from projects.permissions import IsPartOfProject
from projects.serializers import ProjectSerializer, TaskSerializer, BoardSerializer, TaskDetailsSerializer


class CustomCursorPag(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10

    def get_paginated_response(self, data):
        return Response({
            'links'  : {
                'next'    : self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count'  : self.page.paginator.count,
            'results': data
        })


class ProjectRetrieveAPI(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = [AllowAny]

    def get_object(self):
        return Project.objects.select_related('creator').get(id=self.kwargs['pk'])

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = ProjectSerializer(obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectBoardsListCreateAPI(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    queryset = Board.objects.select_related('project', 'creator')
    permission_classes = [AllowAny]

    # permission_classes = [IsAuthenticated, IsPartOfProject]

    def list(self, request, *args, **kwargs):
        data = {}
        try:
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        qs = Board.objects.select_related('project').prefetch_related('board_tasks').filter(project=project)
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
        return Response(data=data, status=status.HTTP_200_OK)


class ProjectTaskListCreateAPI(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [AllowAny]
    pagination_class = CustomCursorPag

    def list(self, request, *args, **kwargs):
        data = {}
        try:
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        qs = Task.objects.select_related('creator').prefetch_related('assigned').filter(project=project)
        serializer = TaskSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new instance of the task model using project F-key and add it to the first board of the project
         if exist or return error
        :param request:
        :param args:
        :param kwargs:
        :return api response:
        """
        data = {}
        try:
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("sorry, we encountered an error, project may have been deleted")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        if not project.project_boards.all():
            data['message'] = _("This project has no boards yet, please create one first")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(creator=request.user, project=project, board=project.project_boards.all()[0])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class BoardTaskCreateAPI(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.select_related('creator').prefetch_related('assigned')

    def list(self, request, *args, **kwargs):
        data = {}
        try:
            board = Board.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        qs = Task.objects.select_related('creator').prefetch_related('assigned').filter(board=board)
        serializer = TaskSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new instance of the task model using board F-key relationship
        :param request:
        :param args:
        :param kwargs:
        :return api response:
        """
        data = {}
        try:
            board = Board.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("sorry, we encountered an error, board may have been deleted")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(creator=request.user, board=board, project=board.project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class TaskRetrieveDestroyAPI(generics.RetrieveDestroyAPIView):
    """retrieves all the details of the task or delete it depending on the request"""
    serializer_class = TaskDetailsSerializer
    queryset = Task.objects.all()
    permission_classes = [AllowAny]

    def get_object(self):
        return Task.objects.select_related('creator').prefetch_related(
            'assigned', 'mini_tasks').get(id=self.kwargs['pk'])

    def retrieve(self, request, *args, **kwargs):
        data = {}
        try:
            task = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you you looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskDetailsSerializer(task, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        data = {}
        try:
            task = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("task may already have been deleted")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        self.perform_destroy(instance=task)
        data['message'] = _('task deleted successfully')
        return Response(data=data, status=status.HTTP_200_OK)
