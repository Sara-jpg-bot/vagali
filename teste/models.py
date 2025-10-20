from django.db import models
#TABELAS DO BANCO DE DADOS
from uuid import uuid4
from django.core.validators import MinLengthValidator, RegexValidator #põe limites no q deverá ser inserido

 
# Create your models here.
class Profissional(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=50)
    telefone = models.CharField(max_length=11, 
                               validators=[RegexValidator(regex=r'^\d{10,11}$', 
                                message='O telefone deve conter entre 10 e 11 dígitos')]
                               )
    cpf = models.CharField(unique=True,
        max_length=11,
        validators=[RegexValidator(r'^\d{11}$', 'CPF deve ter 11 números.')]
                            )
    senha = models.CharField(max_length= 20, #maximo de letras
                            validators=[MinLengthValidator(4), #minimo de letras
                            RegexValidator(regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&]).+$',
                                           message='A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere' )]
                            )
    criado_em = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.nome