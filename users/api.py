from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from allauth.account.admin import EmailAddress
from allauth.account.utils import send_email_confirmation
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException, NotFound
from rest_framework.views import APIView

User = get_user_model()


class ResendEmailConfirmationAPI(APIView):
    """
    API to resend email confirmation to users, if it happens that the previously sent link is broken or expired
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = {}
        user = get_object_or_404(User, email=request.data['email'])
        email_address = EmailAddress.objects.filter(user=user, verified=True).exists()

        if email_address:
            data['response'] = 'This email is already verified'
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                send_email_confirmation(request, user=user)
                data['response'] = 'New Email confirmation link sent'
                return Response(data=data, status=status.HTTP_201_CREATED)
            except APIException:
                # data['response'] = 'This email does not exist, please create a new account'
                # return Response(data=data, status=status.HTTP_404_NOT_FOUND)
                raise NotFound(detail='This email does not exist, please create a new account')
