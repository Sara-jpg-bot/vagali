from flask import Blueprint, request, jsonify
# Importa o objeto 'db'
from database import db, bcrypt_instance # 🚨 CRÍTICO: Importa bcrypt_instance para checar a senha!
# Importa a classe Usuario (o modelo)
from backend.models.usuario_model import Usuario 
# 🚨 NOVO IMPORT: Funções para criar o token JWT
from flask_jwt_extended import create_access_token 

# Cria o Blueprint
user_bp = Blueprint('user', __name__, url_prefix='/api/auth')

# =================================================================
# ROTA DE REGISTRO (CADASTRO) - JÁ EXISTENTE
# URL COMPLETA: POST /api/auth/register
# =================================================================
@user_bp.route('/register', methods=['POST'])
def register_user():
    """ 
    Recebe os dados do formulário de cadastro base do frontend e salva no BD.
    """
    data = request.get_json()

    if not data or not all(data.get(field) for field in ['nome', 'email', 'senha', 'cpf']):
        return jsonify({"erro": "Campos obrigatórios (nome, email, senha, cpf) estão faltando."}), 400

    # Verifica se o email já está cadastrado (Status 409 Conflict)
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"erro": "Este e-mail já está cadastrado."}), 409
        
    # 🚨 Lembrete: A criptografia da senha deve ocorrer no model ou antes de salvar.
    # Assumindo que seu modelo Usuario.senha lida com o hash.
    novo_usuario = Usuario( 
        nome=data['nome'], 
        email=data['email'], 
        senha=data['senha'], 
        cpf=data['cpf'], 
        telefone=data.get('telefone')
    )
    
    try:
        db.session.add(novo_usuario)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao salvar no BD: {e}")
        return jsonify({"erro": "Erro interno ao processar o registro."}), 500

    return jsonify({
        "mensagem": f"Usuário '{novo_usuario.nome}' registrado com sucesso!",
        "id_usuario": novo_usuario.id,
        "proximo_passo": "escolha_de_perfil"
    }), 201

# =================================================================
# ROTA DE LOGIN - NOVA IMPLEMENTAÇÃO
# URL COMPLETA: POST /api/auth/login
# =================================================================
@user_bp.route('/login', methods=['POST'])
def login():
    # 1. Coleta dados JSON (email e senha)
    data = request.get_json()
    if not data or 'email' not in data or 'senha' not in data:
        return jsonify({"erro": "Email e senha são obrigatórios."}), 400

    email = data.get('email')
    senha = data.get('senha')

    # 2. Busca o usuário pelo email
    usuario = Usuario.query.filter_by(email=email).first()

    # 3. Verifica se o usuário existe e se a senha está correta
    # O método 'check_password_hash' usa o bcrypt para comparar a senha de texto com o hash
    if usuario and bcrypt_instance.check_password_hash(usuario.senha_hash, senha):
        
        # 4. Credenciais Válidas: Gera o Token JWT
        # O token conterá o ID do usuário (identity)
        access_token = create_access_token(identity=usuario.id)
        
        # 5. Retorna o Token para o Front-end
        return jsonify({
            "mensagem": "Login bem-sucedido!",
            "access_token": access_token
        }), 200 # Status 200 OK
    else:
        # 6. Credenciais Inválidas
        return jsonify({"erro": "Credenciais inválidas. Verifique seu email e senha."}), 401 