from django.urls import path

from projects.api import ProjectRetrieveAPI, ProjectMembersListAPI, AcceptInviteAPI, InvitationRetrieveUpdate, \
    ProjectListCreateAPI

app_name = 'projects'

urlpatterns = [
    path('req/projects/', ProjectListCreateAPI.as_view(), name='user-projects'),
    path('req/project/<str:pk>/', ProjectRetrieveAPI.as_view(), name='project-retrieve'),
    path('req/project/<str:pk>/invites', InvitationRetrieveUpdate.as_view(), name='project-invitation'),
    path('req/project/invite', AcceptInviteAPI.as_view(), name='project-invitation-accept'),
    path('req/project/<str:pk>/members/', ProjectMembersListAPI.as_view(), name='project-members'),
]
