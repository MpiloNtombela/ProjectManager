from django.urls import path

from projects.api import (ProjectRetrieveAPI, ProjectBoardsListCreateAPI, TaskDetailsAPI, BoardDestroyAPI,
                          ProjectTaskListCreateAPI, BoardTaskCreateAPI)

urlpatterns = [
    path('req/project/<str:pk>/', ProjectRetrieveAPI.as_view(), name='project-retrieve'),
    path('req/project/<str:pk>/boards/', ProjectBoardsListCreateAPI.as_view(), name='project-boards'),
    path('req/project/<str:pk>/tasks/', ProjectTaskListCreateAPI.as_view(), name='project-tasks'),
    path('req/board/<str:pk>/', BoardDestroyAPI.as_view(), name='board-details'),
    path('req/board/<str:pk>/tasks/', BoardTaskCreateAPI.as_view(), name='board-tasks'),
    path('req/task/<str:pk>/', TaskDetailsAPI.as_view(), name='task-details'),
]
