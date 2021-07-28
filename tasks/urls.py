from django.urls import path

from tasks.api import (BoardTaskCreateAPI, ProjectTaskListAPI, TaskMoveAPI, TaskRetrieveUpdateDestroyAPI, SubtaskListCreateAPI,
                       TaskCommentListCreateAPI, AddRemoveTaskMemberAPI, SubtaskRetrieveUpdateDestroyAPI, TaskCommentDestroyAPI)

app_name = 'tasks'

urlpatterns = [
    path('req/project/<str:pk>/tasks/', ProjectTaskListAPI.as_view(), name='project-tasks'),
    path('req/board/<str:pk>/tasks/', BoardTaskCreateAPI.as_view(), name='board-tasks'),
    path('req/task/<str:pk>/', TaskRetrieveUpdateDestroyAPI.as_view(), name='task-retrieve-destroy'),
    path('req/task/<str:pk>/subtasks/', SubtaskListCreateAPI.as_view(), name='subtasks'),
    path('req/task/<str:pk>/comments/', TaskCommentListCreateAPI.as_view(), name='task-comments'),
    path('req/task/<str:pk>/members/', AddRemoveTaskMemberAPI.as_view(), name='task-members'),
    path('req/subtask/<str:pk>/', SubtaskRetrieveUpdateDestroyAPI.as_view(), name='subtask'),
    path('req/comment/<str:pk>/', TaskCommentDestroyAPI.as_view(), name='comment-destroy'),
    path('req/task/<str:pk>/move/', TaskMoveAPI.as_view(), name='task-move')
]
