from django.urls import path

from projects.api import ProjectRetrieveAPI, ProjectBoardsListCreateAPI, TaskDetailsAPI, BoardDestroyAPI

urlpatterns = [
    path('req/project/<str:pk>/', ProjectRetrieveAPI.as_view(), name='project-retrieve'),
    path('req/project/<str:pk>/boards/', ProjectBoardsListCreateAPI.as_view(), name='project-boards-list'),
    path('req/board/<str:pk>/', BoardDestroyAPI.as_view(), name='board-details'),
    path('req/task/<str:pk>/', TaskDetailsAPI.as_view(), name='task-details'),
]
