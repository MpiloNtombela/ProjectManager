from django.urls import path

from projects.apis.boards import ProjectBoardsListCreateAPI, BoardRetrieveUpdateDestroyAPI
from projects.apis.projects import ProjectRetrieveAPI, ProjectMembersListAPI
from projects.apis.tasks import (ProjectTaskListCreateAPI, BoardTaskCreateAPI, TaskRetrieveUpdateDestroyAPI,
                                 TaskCommentListCreateAPI, TaskCommentDestroyAPI, AddRemoveTaskMemberAPI, SubtaskListCreateAPI,
                                 SubtaskRetrieveUpdateDestroyAPI)

urlpatterns = [
    path('req/project/<str:pk>/', ProjectRetrieveAPI.as_view(), name='project-retrieve'),
    path('req/project/<str:pk>/boards/', ProjectBoardsListCreateAPI.as_view(), name='project-boards'),
    path('req/project/<str:pk>/tasks/', ProjectTaskListCreateAPI.as_view(), name='project-tasks'),
    path('req/board/<str:pk>/', BoardRetrieveUpdateDestroyAPI.as_view(), name='board-destroy'),
    path('req/board/<str:pk>/tasks/', BoardTaskCreateAPI.as_view(), name='board-tasks'),
    path('req/task/<str:pk>/', TaskRetrieveUpdateDestroyAPI.as_view(), name='task-retrieve-destroy'),
    path('req/task/<str:pk>/subtasks/', SubtaskListCreateAPI.as_view(), name='subtasks'),
    path('req/task/<str:pk>/comments/', TaskCommentListCreateAPI.as_view(), name='task-comments'),
    path('req/task/<str:pk>/members/', AddRemoveTaskMemberAPI.as_view(), name='task-members'),
    path('req/subtask/<str:pk>/', SubtaskRetrieveUpdateDestroyAPI.as_view(), name='subtask'),
    path('req/comment/<str:pk>/', TaskCommentDestroyAPI.as_view(), name='comment-destroy'),

    path('req/project/<str:pk>/users/', ProjectMembersListAPI.as_view(), name='project-members'),
]
