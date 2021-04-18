from django.contrib import admin

# Register your models here.
from tasks.models import Task, TaskLog, Subtask, TaskComment


class TaskInline(admin.StackedInline):
    model = Task
    show_change_link = True
    raw_id_fields = ['creator']


class TaskLogInline(admin.StackedInline):
    model = TaskLog
    raw_id_fields = ['user']


class SubTasksInline(admin.StackedInline):
    model = Subtask
    raw_id_fields = ['creator']


class TaskCommentsInline(admin.StackedInline):
    model = TaskComment
    raw_id_fields = ['commenter']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    **task** model admin display
    """
    list_display = ['id', 'name', 'creator', 'board', 'deadline', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'deadline']
    search_fields = ['id', 'creator__username', 'name', 'board__name', 'board__project__name']
    inlines = [SubTasksInline, TaskCommentsInline, TaskLogInline]
    raw_id_fields = ['creator', 'board', 'members']
    save_on_top = True


@admin.register(Subtask)
class SubTaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'creator', 'task', 'complete', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'updated_on']
    search_fields = ['id', 'creator__username', 'name']


@admin.register(TaskLog)
class TaskLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'log', 'task', 'timestamp']
    search_fields = ['id', 'user__username', 'task__name', 'log']
    list_filter = ['timestamp']
    raw_id_fields = ['user', 'task']
