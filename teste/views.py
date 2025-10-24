from rest_framework import generics
from .models import Profissional
from .serializers import ProfissionalSerializer
from rest_framework.permissions import AllowAny

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages


class ProfissionalCreateView(generics.CreateAPIView):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer
    permission_classes = [AllowAny]  # qualquer pessoa pode se cadastrar


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # redireciona para a página inicial
        else:
            messages.error(request, 'Usuário ou senha incorretos')

    return render(request, 'teste/login.html')
