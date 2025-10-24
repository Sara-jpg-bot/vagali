from django.contrib import admin
from django.urls import path
from rest_framework import routers
from teste.views import ProfissionalCreateView , login_view
from rest_framework.authtoken import views as drf_authtoken_views

urlpatterns = [
    path('cadastro/', ProfissionalCreateView.as_view(), name='cadastro'),
    path('api-token-auth/', drf_authtoken_views.obtain_auth_token, name='api_token_auth'),
     path('login/', login_view, name='login'),
]

