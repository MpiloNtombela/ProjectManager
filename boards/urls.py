from django.urls import path

from boards.api import ProjectBoardsListCreateAPI, BoardRetrieveUpdateDestroyAPI

app_name = 'boards'
urlpatterns = [
    path('req/project/<str:pk>/boards/', ProjectBoardsListCreateAPI.as_view(), name='project-boards'),
    path('req/board/<str:pk>/', BoardRetrieveUpdateDestroyAPI.as_view(), name='board-destroy'),
]