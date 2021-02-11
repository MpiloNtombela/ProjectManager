import debug_toolbar
from dj_rest_auth.registration.views import VerifyEmailView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path

from frontend.views import index
from users.api import ResendEmailConfirmationAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/password/reset/confirm/<str:uidb64>/<str:token>', index, name='password_reset_confirm'),

    # endpoint to send key using post request
    path('api/auth/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    re_path(r'^apis/auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$', index,
            name='account_confirm_email'),
    path('apis/auth/resend-account-confirmation-email/', ResendEmailConfirmationAPI.as_view(),
         name='resend-account-confirmation-email'),

    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api-auth/drf/', include('rest_framework.urls')),
    # path('apis/u/', include('users.urls')),
    path('api/projects/', include('projects.urls')),
    path('__debug__/', include(debug_toolbar.urls))
]

if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += path('', include("frontend.urls")),
else:
    urlpatterns += path('', include("frontend.urls"))
