from django.contrib import admin

from boards.admin import BoardInline
from projects.models import Project, Invitation  # ProjectTask, ProjectBoard


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'key', 'anyone', 'active']
    search_fields = ['project__id', 'project__name']
    actions = ['remove_key']

    @admin.action(description='remove invite key')
    def remove_key(self, request, queryset):
        queryset.update(key=None, passcode=None)


class InvitationInline(admin.StackedInline):
    model = Invitation
    show_change_link = True
    readonly_fields = ('id', 'key', 'passcode')

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

    actions = ['remove_key']

    @admin.action(description='remove invite key')
    def remove_key(self, request, queryset):
        for proj in queryset:
            proj.invitation.gen_key()
