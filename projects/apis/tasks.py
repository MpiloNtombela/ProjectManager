from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from projects.models import Task, Board, Project, TaskComment
from projects.serializers import TaskViewSerializer, TaskSerializer, TaskCommentSerializer, ProjectUserSerializer
from users.models import User


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
            qs = Task.objects.select_related('creator', 'board').prefetch_related('members').filter(
                project_id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        # qs = Task.objects.select_related('creator').prefetch_related('members').filter(project=project)
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
    queryset = Task.objects.select_related('creator').prefetch_related('members')

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

        qs = Task.objects.select_related('creator').prefetch_related('members').filter(board=board)
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


class TaskRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    """
    apis to retrieve or destroy/delete tasks
    """
    serializer_class = TaskViewSerializer
    queryset = Task.objects.all()
    permission_classes = [AllowAny]

    def get_object(self):
        return Task.objects.select_related('creator').prefetch_related(
            'members', 'subtasks').get(id=self.kwargs['pk'])

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
        serializer = TaskViewSerializer(task, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """
        destroys or delete a task given the id
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: success message if no error
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

    def patch(self, request, *args, **kwargs):
        data = {}
        try:
            task = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("Uhh Ohh something went wrong")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        _serializer = self.get_serializer_class()
        serializer = _serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            data['message'] = _('task updated successfully')
            data['response'] = request.data
            return Response(data, status=status.HTTP_200_OK)
        data['message'] = _('Oops... bad request!')
        data['response'] = serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


class TaskCommentListCreateAPI(generics.ListCreateAPIView):
    serializer_class = TaskCommentSerializer
    queryset = TaskComment.objects.select_related('commenter')

    def list(self, request, *args, **kwargs):
        """
        lists all the comments for that particular tasks
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: a list/array of comments
        """
        data = {}
        try:
            qs = TaskComment.objects.select_related('commenter').filter(task_id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskCommentSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new task comment
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: newly created comment
        """
        data = {}
        try:
            task = Task.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("sorry, we encountered an error, task may have been deleted")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        serializer = TaskCommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(commenter=request.user, task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class TaskCommentDestroyAPI(generics.DestroyAPIView):
    serializer_class = TaskCommentSerializer
    queryset = TaskComment.objects.select_related('commenter')

    def get_object(self):
        return TaskComment.objects.select_related('commenter').get(id=self.kwargs['pk'])

    def destroy(self, request, *args, **kwargs):
        """
        destroys or delete a comment given the id
        :param request: request object
        :param args: args
        :param kwargs: <pk> comment id
        :return: success message if no error
        """
        data = {}
        try:
            comment = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("comment may already have been deleted")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        if not comment.can_be_deleted_by(request.user):
            data['message'] = _("permission denied to delete comment")
            return Response(data=data, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance=comment)
        data['message'] = _('comment deleted successfully')
        return Response(data=data, status=status.HTTP_200_OK)


class AddRemoveTaskMemberAPI(generics.UpdateAPIView):
    # queryset = Task.objects.select_related('creator').prefetch_related('members')
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.select_related('creator').prefetch_related('members').get(id=self.kwargs['pk']).members

    def get_object(self):
        return Task.objects.select_related('creator').prefetch_related('members').get(id=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        data = {}
        try:
            task = self.get_object()
        except ObjectDoesNotExist:
            data['message'] = _("Oops... something went wrong")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(id=request.data['id'])
        except ObjectDoesNotExist:
            data['message'] = _("user not found")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        if request.data['type'].lower() == 'remove':
            task.remove_user(user)
            data['message'] = f'{user.username} removed from task members'
            data['response'] = ProjectUserSerializer(user).data
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            if task.user_is_valid(user):
                task.add_user(user)
                data['message'] = f'{user.username} added to task members'
                data['response'] = ProjectUserSerializer(user).data
                return Response(data=data, status=status.HTTP_200_OK)
            else:
                data['message'] = _('only project members can be added to task members')
                return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
