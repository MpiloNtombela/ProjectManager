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
    queryset = Board.objects.select_related('project', 'creator')
    permission_classes = [AllowAny]

    # permission_classes = [IsAuthenticated, IsPartOfProject]

    def list(self, request, *args, **kwargs):
        """
        list all the boards for the project
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: list/array of boards
        """
        data = {}
        try:
            qs = Board.objects.select_related('project').filter(project_id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        serializer = BoardSerializer(instance=qs, many=True, context={'request': request})
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
        try:
            inst = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("board may already have been deleted")
            return Response(status=status.HTTP_404_NOT_FOUND)
        self.perform_destroy(instance=inst)
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
        try:
            board = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("Uhh Ohh something went wrong")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        _serializer = self.get_serializer_class()
        serializer = _serializer(board, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            data['message'] = _('board updated successfully')
            data['response'] = request.data
            return Response(data, status=status.HTTP_200_OK)
        data['message'] = _('Oops... bad request!')
        data['response'] = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)