from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, status, filters
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from base.api import CheckProjectPermissionMixin
from projects.models import Invitation
from projects.permissions import IsProjectCreator
from projects.serializers import ProjectSerializer, AcceptInvitationSerializer, InvitationSerializer
from users.serializers import BasicUserSerializer


class ProjectRetrieveAPI(CheckProjectPermissionMixin, generics.RetrieveAPIView):
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
    queryset = Invitation.objects.select_related("project")
    error_message = _('link provided is invalid or expired')

    def retrieve(self, request, *args, **kwargs) -> object:
        data = {}
        key = request.query_params.get("key", None)
        data["message"] = self.error_message
        if key is None or len(key) < 20:
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        inv = get_object_or_404(
            Invitation.objects.select_related("project", "project__creator"),
            key=key,
            active=True
        )
        serializer = AcceptInvitationSerializer(inv, context={"request": request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        data = {}
        key = request.query_params.get("key", None)
        data["message"] = self.error_message
        if key is None or len(key) < 20:
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        inv = get_object_or_404(
            Invitation.objects.select_related("project", "project__creator"),
            key=key,
            active=True
        )
        inv.project.add_member(request.user)
        data["message"] = f"{_('You have joined')} {inv.project.name}"
        data["response"] = {"id": str(inv.project.id)}
        return Response(data=data, status=status.HTTP_200_OK)


class InvitationRetrieveUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsProjectCreator]
    queryset = Invitation.objects.select_related("project", "project__creator")

    def get_object(self):
        inv = get_object_or_404(self.get_queryset(), project_id=self.kwargs["pk"])
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