from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from boards.models import Board
from projects.models import Project
from tasks.models import Task, Subtask, TaskComment
from tasks.serializers import TaskSerializer, TaskViewSerializer, SubtaskSerializer, TaskCommentSerializer
from users.models import User
from users.serializers import BasicUserSerializer

ERROR_404_MESSAGE = _("sorry we can't find what you're want")


class ProjectTaskListAPI(generics.ListCreateAPIView):
    """
    apis to get or create new tasks given project id
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

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
                board__project_id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("we can't find what you're looking for")
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        # qs = Task.objects.select_related('creator').prefetch_related('members').filter(project=project)
        serializer = TaskSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)


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
            serializer.save(creator=request.user, board=board)
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


class SubtaskListCreateAPI(generics.ListCreateAPIView):
    serializer_class = SubtaskSerializer
    queryset = Subtask.objects.select_related('task')

    def list(self, request, *args, **kwargs):
        """
        lists subtasks for tasks
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: a list/array of subtask
        """
        data = {}
        try:
            qs = Subtask.objects.select_related('task').filter(task_id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = ERROR_404_MESSAGE
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        serializer = SubtaskSerializer(instance=qs, many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        creates a new subtask
        :param request: request object
        :param args: args
        :param kwargs: <pk> task id
        :return: newly created subtask
        """
        data = {}
        try:
            task = Task.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("sorry, we encountered an error, task may have been deleted")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        serializer = SubtaskSerializer(data={'name': request.data['name']}, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save(creator=request.user, task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class SubtaskRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    """
    api to update or destroy/delete subtasks
    """
    serializer_class = SubtaskSerializer
    queryset = Subtask.objects.select_related('task')

    def destroy(self, request, *args, **kwargs):
        """
        destroys or delete a subtask given the id
        :param request: request object
        :param args: args
        :param kwargs: <pk> subtask id
        """
        data = {}
        subtask = get_object_or_404(Subtask, pk=self.kwargs['pk'])
        self.perform_destroy(instance=subtask)
        data['message'] = _('subtask deleted successfully')
        return Response(data=data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        data = {}
        try:
            subtask = Subtask.objects.get(id=self.kwargs['pk'])
        except ObjectDoesNotExist:
            data['message'] = _("sorry, we encountered an error, task may have been deleted")
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        serializer = SubtaskSerializer(subtask, data={'complete': request.data['complete']}, partial=True)
        if serializer.is_valid():
            serializer.save()
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
            data['message'] = ERROR_404_MESSAGE
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
            data['response'] = BasicUserSerializer(user).data
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            if task.user_is_valid(user):
                task.add_user(user)
                data['message'] = f'{user.username} added to task members'
                data['response'] = BasicUserSerializer(user).data
                return Response(data=data, status=status.HTTP_200_OK)
            else:
                data['message'] = _('only project members can be added to task members')
                return Response(data=data, status=status.HTTP_400_BAD_REQUEST)