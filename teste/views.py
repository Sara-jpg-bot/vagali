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



#faz a conexão com o html
def login_view(request): #o request puxa
    if request.method == 'POST': # metodo post: é para adicionar dados
        username = request.POST.get('username') # tratá do html os dados que foram inseridos no 'username' para o username
        password = request.POST.get('password') #traz os dados que foram inseridos no 'password' para o password

        user = authenticate(request, username=username, password=password) # confere se as informações são iguais
        if user is not None: # se forem iguais
            login(request, user)
            return redirect('home')  # redireciona para a página inicial
        else: # se estiver incorreto, irá barrar
            messages.error(request, 'Usuário ou senha incorretos')

    return render(request, 'teste/login.html')

def cadastro_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        cpf = request.POST.get('cpf', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        password2 = request.POST.get('password2', '')

        if not all([username, email, telefone, cpf, password, password2]):
            messages.error(request, 'Preencha todos os campos')
            return render(request, 'teste/cadastro.html')
        
        if password != password2:
            messages.error(request, 'As senhas devem ser iguais.')
            return render(request, 'teste/cadastro.html')
        
        data = {
            'username': username,
            'telefone': telefone,
            'cpf': cpf,
            'email': email,
            'password': password,
            'password2': password2
        }
        serializer = ProfissionalSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            messages.success(request, 'Cadastro realizado com sucesso! Faça login.')
            return redirect('login')
        else:
            for field, errs in serializer.errors.items():
                messages.error(request, f"{field}: {', '.join(map(str, errs))}")

        return render(request, 'teste/cadastro.html')
    
    # se for GET, apenas exibe o formulário
    return render(request, 'teste/cadastro.html')


# Página inicial
def home_view(request):
    return render(request, 'teste/home.html')
