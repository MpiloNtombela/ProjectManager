from base.utils import get_list_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from boards.models import Board
from boards.serializers import BoardSerializer
from projects.models import Project


class ProjectBoardsListCreateAPI(generics.ListCreateAPIView):
    """
    apis to get or create board(s)
    """
    serializer_class = BoardSerializer
    permission_classes = [AllowAny]

    # permission_classes = [IsAuthenticated, IsPartOfProject]

    def get_queryset(self):
        queryset = Board.objects.select_related('project').prefetch_related('board_tasks')
        queryset = self.get_serializer_class().dynamic_load(queryset)
        return queryset


    def list(self, request, *args, **kwargs):
        """
        list all the boards for the project
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: list/array of boards
        """
        data = {}
        qs = get_list_or_404(self.get_queryset(), project_id=kwargs.get('pk'))

        serializer = self.get_serializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new board
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: newly created board
        """
        data = {}
        project = generics.get_object_or_404(Project, id=kwargs.get('pk'))
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(creator=request.user, project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class BoardRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    """
    apis to retrieve, update or destroy board(s)
    """
    serializer_class = BoardSerializer
    queryset = Board.objects.select_related('project')

    # permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        """
        destroy or delete board **with all it tasks**
        :param request: request object
        :param args: args
        :param kwargs: <pk> board id
        :return: API Response
        """
        data = {}
        board = self.get_object()
        self.perform_destroy(instance=board)
        data['message'] = _('board deleted successfully')
        return Response(data=data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        """
        update board
        :param request: request object
        :param args: args
        :param kwargs: <pk> board id
        :return: API Response
        """
        data = {}
        board = self.get_object()
        # _serializer = self.get_serializer_class()
        serializer = self.get_serializer_class(board, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            data['message'] = _('board updated successfully')
            data['response'] = request.data
            return Response(data, status=status.HTTP_200_OK)
        data['message'] = _('Oops... bad request!')
        data['response'] = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
