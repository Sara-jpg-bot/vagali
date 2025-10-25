# Backend/models/usuario_model.py

# A classe Usuario precisa do objeto 'db' para se conectar ao banco de dados
# 🚨 AJUSTE: Importa o objeto bcrypt_instance do database.py
from database import db, bcrypt_instance 

class Usuario(db.Model):
    # Define o nome da tabela no BD
    __tablename__ = 'usuarios' 
    
    # Colunas da tabela. 'primary_key=True' faz o ID ser gerado automaticamente.
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    # 'unique=True' garante que não haverá dois usuários com o mesmo e-mail.
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False) # Armazena a senha criptografada
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    telefone = db.Column(db.String(20), nullable=True)

    # ===============================================
    # LÓGICA DE CRIPTOGRAFIA DE SENHA
    # ===============================================

    @property
    def senha(self):
        raise AttributeError('senha: campo de escrita (write-only)')

    @senha.setter
    def senha(self, senha_texto_claro):
        # Gera o hash da senha usando a instância importada do database.py
        self.senha_hash = bcrypt_instance.generate_password_hash(senha_texto_claro).decode('utf-8')

    def verificar_senha(self, senha_texto_claro):
        return bcrypt_instance.check_password_hash(self.senha_hash, senha_texto_claro)


    def __repr__(self):
        return f"Usuario('{self.nome}', '{self.email}')"
