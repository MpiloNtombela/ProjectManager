from allauth.account.adapter import DefaultAccountAdapter
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _


class RestrictEmailAdapter(DefaultAccountAdapter):
    """
    .. note::
    This will restrict the **registration to users** with emails specified (.ac.za) academic emails
    """

    def clean_email(self, email):
        if not email.endswith('.ac.za'):
            raise ValidationError(_("we're currently open to SA universities only"))
        return email
