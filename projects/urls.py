from django.urls import path

from projects.apis.boards import ProjectBoardsListCreateAPI, BoardDestroyAPI
from projects.apis.projects import ProjectRetrieveAPI
from projects.apis.tasks import ProjectTaskListCreateAPI, BoardTaskCreateAPI, TaskRetrieveDestroyAPI

urlpatterns = [
    path('req/project/<str:pk>/', ProjectRetrieveAPI.as_view(), name='project-retrieve'),
    path('req/project/<str:pk>/boards/', ProjectBoardsListCreateAPI.as_view(), name='project-boards'),
    path('req/project/<str:pk>/tasks/', ProjectTaskListCreateAPI.as_view(), name='project-tasks'),
    path('req/board/<str:pk>/', BoardDestroyAPI.as_view(), name='board-destroy'),
    path('req/board/<str:pk>/tasks/', BoardTaskCreateAPI.as_view(), name='board-tasks'),
    path('req/task/<str:pk>/', TaskRetrieveDestroyAPI.as_view(), name='task-retrieve-destroy'),
]
