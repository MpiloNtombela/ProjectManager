from django.shortcuts import render


def index(request, **kwargs):
    return render(request, "frontend/index.html")
