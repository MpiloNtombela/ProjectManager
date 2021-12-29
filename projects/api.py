from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework import generics, status, filters
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from base.api import CheckProjectPermissionMixin
from projects.models import Invitation, Project
from projects.permissions import IsProjectCreator
from projects.serializers import ProjectSerializer, AcceptInvitationSerializer, InvitationSerializer
from users.serializers import BasicUserSerializer
from projects.utils import is_valid_uuid


class ProjectListCreateAPI(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.select_related('creator').prefetch_related('members')

    def get_queryset(self):
        return super().get_queryset().filter(Q(creator=self.request.user) | Q(members__id=self.request.user.id)).distinct()

    def get_serializer_context(self) -> object:
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


class ProjectRetrieveAPI(CheckProjectPermissionMixin, generics.RetrieveDestroyAPIView):
    """
    apis to retrieve project
    """

    serializer_class = ProjectSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        retrieves a single project given it id
        :param request: request object
        :param args: args
        :param kwargs: <pk> project id
        :return: project object
        """
        obj = self.get_object()
        serializer = ProjectSerializer(obj, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectMembersListAPI(CheckProjectPermissionMixin, generics.ListAPIView):
    serializer_class = BasicUserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["username"]

    def list(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = BasicUserSerializer(project.members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AcceptInviteAPI(generics.RetrieveUpdateAPIView):
    serializer_class = AcceptInvitationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Invitation.objects.select_related("project", 'project__creator')
    error_message = _('link provided is invalid or expired')

    def get_object(self):
        inv = get_object_or_404(
            Invitation.objects.select_related("project", "project__creator"),
            project_id=self.request.query_params.get('kit'),
            key=self.request.query_params.get('key'),
            active=True
        )
        return inv

    def retrieve(self, request, *args, **kwargs) -> object:
        data = {}
        id = request.query_params.get("kit", None)
        key = request.query_params.get("key", None)
        data["message"] = self.error_message
        if id is None or key is None or not is_valid_uuid(key, 4):
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        inv = self.get_object()
        serializer = AcceptInvitationSerializer(inv, context={"request": request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        data = {}
        key = request.query_params.get("key", None)
        data["message"] = self.error_message
        if key is None or not is_valid_uuid(key, 4):
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        inv = self.get_object()
        if not inv.anyone:
            if not request.data['passcode'] or request.data['passcode'] != inv.passcode:
                data['message'] = f"{_('Invalid passcode')}"
                return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        inv.project.add_member(request.user)
        data["message"] = f"{_('You have joined')} {inv.project.name}"
        data["response"] = {"id": str(inv.project.id)}
        return Response(data=data, status=status.HTTP_200_OK)


class InvitationRetrieveUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsProjectCreator]
    queryset = Invitation.objects.select_related("project", "project__creator")

    def get_object(self):
        inv = get_object_or_404(self.get_queryset(), project_id=self.kwargs.get("pk"))
        self.check_object_permissions(self.request, inv)
        return inv

    def retrieve(self, request, *args, **kwargs):
        inv = self.get_object()
        serializer = InvitationSerializer(inv, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        param = request.query_params.get("action", None)
        if param is None or param.lower() not in {"key", "status"}:
            data = {
                "message": _("Oops error, seems the request was tempered")
            }
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        inv = self.get_object()
        if param.lower() == "key":
            inv.gen_key()
        elif param.lower() == "status":
            inv.change_active_status()
        serializer = InvitationSerializer(inv, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
