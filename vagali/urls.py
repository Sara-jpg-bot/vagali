from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from teste.views import ProfissionalViewSet

router = routers.DefaultRouter() #registra o ViewSet
router.register(r'profissionais', ProfissionalViewSet, basename='profissional')


urlpatterns = [
    path('admin/', admin.site.urls), #rota do admin
    path('api/', include(router.urls)), #rotas da api
]
