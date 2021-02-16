from django.contrib import admin

from projects.models import Project, Board, Task, TaskFeed, Subtask  # ProjectTask, ProjectBoard


class BoardInline(admin.StackedInline):
    model = Board
    show_change_link = True
    extra = 1


class TaskInline(admin.StackedInline):
    model = Task
    show_change_link = True


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    **project** model admin display
    """
    list_display = ['id', 'name', 'creator', 'deadline', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'deadline']
    search_fields = ['id', 'creator__username', 'name']
    inlines = [BoardInline, TaskInline]


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    """
    **board** model admin display
    """
    list_display = ['id', 'name', 'creator', 'project', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on']
    search_fields = ['id', 'creator__username', 'name', 'project__name']


class TaskFeedInline(admin.StackedInline):
    model = TaskFeed


class MiniTasksInline(admin.StackedInline):
    model = Subtask


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    **task** model admin display
    """
    list_display = ['id', 'name', 'creator', 'project', 'board', 'deadline', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'deadline']
    search_fields = ['id', 'creator__username', 'name', 'board__name', 'project__name']
    inlines = [MiniTasksInline, TaskFeedInline]


@admin.register(Subtask)
class MiniTaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'creator', 'task', 'complete', 'created_on', 'updated_on']
    list_display_links = ['name']
    list_filter = ['created_on', 'updated_on']
    search_fields = ['id', 'creator__username', 'name']


@admin.register(TaskFeed)
class TaskFeedAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'feed', 'timestamp']
    search_fields = ['id', 'user__username', 'feed']
    list_filter = ['timestamp']

# @admin.register(ProjectBoard)
# class ProjectBoardAdmin(admin.ModelAdmin):
#     pass
#
#
# @admin.register(ProjectTask)
# class ProjectTaskAdmin(admin.ModelAdmin):
#     pass
