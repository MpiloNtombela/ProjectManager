from dj_rest_auth.registration.views import VerifyEmailView
from django.contrib import admin
from django.urls import path, include, re_path

from frontend.views import index
from users.api import ResendEmailConfirmationAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/password/reset/confirm/<str:uidb64>/<str:token>', index, name='password_reset_confirm'),

    # endpoint to send key using post request
    path('api/auth/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    re_path(r'^api/auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$', index,
            name='account_confirm_email'),
    path('api/auth/resend-account-confirmation-email/', ResendEmailConfirmationAPI.as_view(),
         name='resend-account-confirmation-email'),

    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('api/u/', include('users.urls')),
    path('', include("frontend.urls")),
]
