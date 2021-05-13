from django.contrib import admin

# Register your models here.
from boards.models import Board


class BoardInline(admin.StackedInline):
    model = Board
    show_change_link = True
    extra = 1
    raw_id_fields = ['creator']


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    """
    **board** model admin display
    """
    list_display = ['id', 'name', 'creator', 'project', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on']
    search_fields = ['id', 'creator__username', 'name', 'project__name']
    raw_id_fields = ['creator', 'project']
    save_on_top = True
