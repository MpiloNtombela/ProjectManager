from django.urls import path, re_path

from .views import index

urlpatterns = [
    re_path(r"^$", index, name="frontend"),
    re_path(r"[-:\w]+", index, name="frontend-routes"),
]
