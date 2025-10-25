from flask_sqlalchemy import SQLAlchemy
# 🚨 NOVO: Importa Bcrypt para criar uma instância separada
from flask_bcrypt import Bcrypt 

# Cria a instância do SQLAlchemy
db = SQLAlchemy()

# 🚨 NOVO: Cria uma instância de Bcrypt que será inicializada no app.py
bcrypt_instance = Bcrypt() 
