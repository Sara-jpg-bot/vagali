from rest_framework import serializers
from .models import Profissional


#transforma objetos python em json e vice-versa
class ProfissionalSerializer(serializers.ModelSerializer): # sempre segue essa analogia, nome da classe + o impor.ModelImpot
    class Meta:
        model = Profissional #o modelo q sera serializado
        fields = '__all__' #adiciona tudo na api