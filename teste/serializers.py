from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profissional

# Serializador para User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

# Serializador para Profissional, incluindo o usuário
class ProfissionalSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Profissional
        fields = ['username', 'email', 'password', 'telefone', 'cpf']

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create(username=username, email=email)
        user.set_password(password)
        user.save()

        profissional = Profissional.objects.create(user=user, **validated_data)
        return profissional
