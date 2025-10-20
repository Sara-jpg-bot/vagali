from rest_framework import viewsets
from .models import Profissional
from .serializers import ProfissionalSerializer


#fornece meios de visualizações automaticas
class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all().order_by('-id','-criado_em') #dados q serão retornados
    serializer_class = ProfissionalSerializer

# Create your views here.
