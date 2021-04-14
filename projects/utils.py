from django.core.exceptions import ValidationError
from django.http import Http404
from django.shortcuts import get_list_or_404 as _get_list_or_404


def get_list_or_404(queryset, *filter_args, **filter_kwargs):
    """
    Same as Django's standard get_list_or_404 shortcut, but make sure to also raise 404
    if the filter_kwargs don't match the required types.
    """
    try:
        return _get_list_or_404(queryset, *filter_args, **filter_kwargs)
    except (TypeError, ValueError, ValidationError):
        raise Http404