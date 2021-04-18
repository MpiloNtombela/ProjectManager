from django.urls import path

from projects.api import ProjectRetrieveAPI, ProjectMembersListAPI, AcceptInviteAPI, InvitationRetrieveUpdate

app_name = 'projects'

urlpatterns = [
    path('req/project/<str:pk>/', ProjectRetrieveAPI.as_view(), name='project-retrieve'),
    path('req/project/<str:pk>/invites', InvitationRetrieveUpdate.as_view(), name='project-invitation'),
    path('req/project/doge', AcceptInviteAPI.as_view(), name='project-invitation-accept'),
    path('req/project/<str:pk>/members/', ProjectMembersListAPI.as_view(), name='project-members'),
]
