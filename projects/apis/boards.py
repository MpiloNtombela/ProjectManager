from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from projects.models import Project, Board
from projects.serializers import BoardSerializer


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
            project = Project.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        qs = Board.objects.select_related('project').prefetch_related('board_tasks').filter(project=project)
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


class BoardDestroyAPI(generics.DestroyAPIView):
    """
    apis to destroy board(s)
    """
    serializer_class = BoardSerializer
    queryset = Board.objects.select_related('project').all()
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        """
        destroy or delete board **with all it tasks**
        :param request: request object
        :param args: args
        :param kwargs: <pk> board id
        :return: success message if no errors
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
