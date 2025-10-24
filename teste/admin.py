from django.contrib import admin
from .models import Profissional 
#da pasta model , traz a class profissional par administrala

class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'telefone', 'cpf')  # campos visíveis na lista

    # funções para pegar os dados do user
    def username(self, obj):
        return obj.user.username
    username.admin_order_field = 'user__username'
    username.short_description = 'Nome'

    def email(self, obj):
        return obj.user.email
    email.admin_order_field = 'user__email'
    email.short_description = 'Email'

admin.site.register(Profissional, ProfissionalAdmin)
