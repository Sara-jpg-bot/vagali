from rest_framework import generics
from django.db import IntegrityError, transaction
from .models import Profissional
from .serializers import ProfissionalSerializer
from rest_framework.permissions import AllowAny

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login , get_user_model
from django.contrib import messages


User = get_user_model()


class ProfissionalCreateView(generics.CreateAPIView):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer
    permission_classes = [AllowAny]  # qualquer pessoa pode se cadastrar

def index(request):
    return render(request, 'teste/index.html')


#faz a conexão com o html
def login_view(request): #o request puxa
    erro = None
    if request.method == 'POST': # metodo post: é para adicionar dados
        email = request.POST.get('email') # tratá do html os dados que foram inseridos no 'username' para o username
        password = request.POST.get('password') #traz os dados que foram inseridos no 'password' para o password

        user = authenticate(request, username=email, password=password) # confere se as informações são iguais

        if user is None:
            try:
                user_obj = User.objects.filter(email__iexact=email).first()
                if user_obj:
                    print("DEBUG: usuário encontrado por email ->", getattr(user_obj, 'username', None))
                    user = authenticate(request, username=getattr(user_obj, 'username', None), password=password)
            except Exception as e:
                print("DEBUG erro ao buscar user por email:", e)

        if user is not None:
            login(request, user)
            print("DEBUG: login bem-sucedido para:", user)
            return redirect('index')   # usa name da URL
        else:
            erro = 'Email/Usuário ou senha incorretos'
            messages.error(request, erro)

    return render(request, 'teste/login.html', {'erro': erro})

def cadastro_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        cpf = request.POST.get('cpf', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        password2 = request.POST.get('password2', '')

        # validações simples
        if not all([username, email, telefone, cpf, password, password2]):
            messages.error(request, 'Preencha todos os campos')
            return render(request, 'teste/cadastro.html', {'form_data': request.POST})

        if password != password2:
            messages.error(request, 'As senhas devem ser iguais.')
            return render(request, 'teste/cadastro.html', {'form_data': request.POST})

        data = {
            'username': username,
            'telefone': telefone,
            'cpf': cpf,
            'email': email,
            'password': password,
            # não passe password2 para o serializer, se não for necessário
        }

        serializer = ProfissionalSerializer(data=data)
        is_valid = serializer.is_valid()
        print("DEBUG serializer.is_valid() ->", is_valid)
        print("DEBUG serializer.errors ->", serializer.errors)

        if not is_valid:
            for field, errs in serializer.errors.items():
                messages.error(request, f"{field}: {', '.join(map(str, errs))}")
            return render(request, 'teste/cadastro.html', {'form_data': request.POST})

        try:
            with transaction.atomic():
                instance = serializer.save()
            print("DEBUG SALVOU:", instance, getattr(instance, 'pk', None))
            messages.success(request, 'Cadastro realizado com sucesso! Faça login.')
            return redirect('login')   # usa o name 'login' definido em urls
        except IntegrityError as e:
            print("DEBUG IntegrityError ao salvar:", e)
            messages.error(request, 'Erro ao salvar: possível dado duplicado.')
            return render(request, 'teste/cadastro.html', {'form_data': request.POST})

    # GET
    return render(request, 'teste/cadastro.html')


