from django.contrib import admin
from django.urls import path
from teste.views import index,ProfissionalCreateView , login_view,  cadastro_view 
from rest_framework.authtoken import views as drf_authtoken_views
from django.views.generic import RedirectView


#cadastrar a url responsável por abrir a aba correspondente

urlpatterns = [
    path('admin/', admin.site.urls),
    path('cadastro/', cadastro_view, name='cadastro'),  # agora aponta para cadastro_view
    path('api/profissionais/', ProfissionalCreateView.as_view(), name='api_profissional_create'),
    path('api-token-auth/', drf_authtoken_views.obtain_auth_token, name='api_token_auth'),
    path('login/', login_view, name='login'),
    path('', index, name='index'),
]




