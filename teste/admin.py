from django.contrib import admin
from .models import Profissional 
#da pasta model , traz a class profissional par administrala

@admin.register(Profissional) #registra o model no admin
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'telefone', 'cpf', 'senha', 'criado_em') #todas as colunas listadas
    search_fields = ('nome','email','cpf') #oq pode pesquisar