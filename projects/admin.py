from django.contrib import admin

from projects.models import Project, Board, Task


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    **project** model admin display
    """
    list_display = ['id', 'name', 'creator', 'deadline', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'deadline']
    search_fields = ['id', 'creator__username', 'name']


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    """
    **board** model admin display
    """
    list_display = ['id', 'name', 'creator', 'project', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on']
    search_fields = ['id', 'creator__username', 'name', 'project__name']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    **task** model admin display
    """
    list_display = ['id', 'name', 'creator', 'project', 'board', 'deadline', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'deadline']
    search_fields = ['id', 'creator__username', 'name', 'board__name', 'project__name']
