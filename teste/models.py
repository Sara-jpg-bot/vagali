from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
#TABELAS DO BANCO DE DADOS
from uuid import uuid4
from django.core.validators import MinLengthValidator, RegexValidator #põe limites no q deverá ser inserido

 
# Create your models here.
class Profissional(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    telefone = models.CharField(max_length=11, 
                               validators=[RegexValidator(regex=r'^\d{10,11}$', 
                                message='O telefone deve conter entre 10 e 11 dígitos')]
                               )
    cpf = models.CharField(unique=True,
        max_length=11,
        validators=[RegexValidator(r'^\d{11}$', 'CPF deve ter 11 números.')]
                            )
    criado_em = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.user.username