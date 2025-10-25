from rest_framework import serializers
from django.contrib.auth.models import User #nde serão guardados username, email, senha criptografada
from .models import Profissional

# Serializador para User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password'] # fields aceita esses dados
        extra_kwargs = {'password': {'write_only': True}} # faz com q a senha não volte na api, um passo de segurança

    def create(self, validated_data):#é o dicionário dos dados que passaram pela validação do serializer
        password = validated_data.pop('password') #remove a senha para n ser salva em texto
        user = User(**validated_data) #fazs a instancia com os campos do user
        user.set_password(password) #converte a senha em hash seguro
        user.save() #grava o usuário no banco
        return user #retorna oq foi criado

# Serializador para Profissional, incluindo o usuário
class ProfissionalSerializer(serializers.ModelSerializer):
    #adiciona os campos do user junto com os demais, mas n retornem como respostas
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta: #Meta.fields inclui esses campos extras junto com os campos reais do Profissional (telefone, cpf
        model = Profissional
        fields = ['username', 'telefone', 'cpf',  'email', 'password']

    def create(self, validated_data): #criando os campos, para armazenar dados novos
        username = validated_data.pop('username') 
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create(username=username, email=email) #cria o usuário no banco
        user.set_password(password) #verifica a senha
        user.save()

        profissional = Profissional.objects.create(user=user, **validated_data)
        return profissional
