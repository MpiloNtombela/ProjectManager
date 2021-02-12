from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from projects.models import Task, Board, Project
from projects.serializers import TaskDetailsSerializer, TaskSerializer


class ProjectTaskListCreateAPI(generics.ListCreateAPIView):
    """
    apis to get or create new tasks given project id
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        """
        list all the tasks for the project given the project id `(from url kwargs)`
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: list/array of tasks
        """
        data = {}
        try:
            qs = Task.objects.select_related('creator').prefetch_related('assigned').filter(
                project_id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        # qs = Task.objects.select_related('creator').prefetch_related('assigned').filter(project=project)
        serializer = TaskSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new task for the project and add it to the first board of the project.
        **the project must at least have one board**
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: newly created task if no error
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
    """
    apis to get or create new task(s) given board id
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.select_related('creator').prefetch_related('assigned')

    def list(self, request, *args, **kwargs):
        """
        lists all the task for that particular board in the project
        :param request: request object
        :param args: args
        :param kwargs: <pk> board id
        :return: a list/array of tasks
        """
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
        creates a new task for the board
        :param request: request object
        :param args: args
        :param kwargs: <pk> board id
        :return: newly created task if no error
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
    """
    apis to retrieve or destroy/delete tasks
    """
    serializer_class = TaskDetailsSerializer
    queryset = Task.objects.all()
    permission_classes = [AllowAny]

    def get_object(self):
        return Task.objects.select_related('creator').prefetch_related(
            'assigned', 'mini_tasks').get(id=self.kwargs['pk'])

    def retrieve(self, request, *args, **kwargs):
        """
        retrieves all the tasks details
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: task object
        """
        data = {}
        try:
            task = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you you looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskDetailsSerializer(task, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """
        destroys or delete a task given the id
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: success message if n error
        """
        data = {}
        try:
            task = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("task may already have been deleted")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        self.perform_destroy(instance=task)
        data['message'] = _('task deleted successfully')
        return Response(data=data, status=status.HTTP_200_OK)
