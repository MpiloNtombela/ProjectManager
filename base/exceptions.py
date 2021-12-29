from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import APIException
from rest_framework.status import HTTP_400_BAD_REQUEST

class BadRequest(APIException):
    status_code = HTTP_400_BAD_REQUEST
    default_detail = _('Bad request')
    default_code = "bad_request"

    def __init__(self, err_msg=None, code=None):
        super().__init__(detail=err_msg, code=code)
        if err_msg is None:
            err_msg = self.default_detail
        code = self.status_code