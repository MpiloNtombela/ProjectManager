from allauth.account.models import EmailAddress
from django.contrib import admin

# Register your models here.
from users.models import Profile, User, Team


class ProfileInline(admin.StackedInline):
    model = Profile


class EmailAddressInline(admin.TabularInline):
    model = EmailAddress


class UserAdmin(admin.ModelAdmin):
    inlines = (ProfileInline, EmailAddressInline)
    list_display = ('id', 'username', 'email')
    readonly_fields = ('password',)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Team)
