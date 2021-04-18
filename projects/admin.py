from django.contrib import admin

from boards.admin import BoardInline
from projects.models import Project, Invitation  # ProjectTask, ProjectBoard


class InvitationInline(admin.StackedInline):
    model = Invitation
    show_change_link = True
    readonly_fields = ('id', 'key')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    **project** model admin display
    """
    list_display = ['id', 'name', 'creator', 'deadline', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'deadline']
    search_fields = ['id', 'creator__username', 'name']
    inlines = [BoardInline, InvitationInline]
    raw_id_fields = ['creator', 'members', 'teams']
    save_on_top = True
