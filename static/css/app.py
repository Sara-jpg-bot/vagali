from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS 
import os 
from sqlalchemy import exc # Para tratar erros específicos do banco de dados

# ==============================================================================
# 1. CONFIGURAÇÃO DO FLASK, EXTENSÕES E DB
# ==============================================================================
app = Flask(__name__)

# CHAVE SECRETA: ESSENCIAL para a segurança da sessão
app.config['SECRET_KEY'] = 'aqui_vai_uma_chave_secreta_longa_e_unica_para_o_vagali'

# Configuração do Banco de Dados SQLite
BASEDIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASEDIR, 'vagali.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização das Extensões
db = SQLAlchemy(app)
CORS(app) # Habilita o CORS

# ==============================================================================
# 2. DEFINIÇÃO DO MODELO DO BANCO DE DADOS
# ==============================================================================

# Modelo de Demandas
class Demanda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Coluna usada para associar a demanda ao cliente logado
    cliente_id = db.Column(db.Integer, nullable=False, default=1) 
    
    titulo = db.Column(db.String(120), nullable=False)
    subtitulo = db.Column(db.String(120), nullable=True)
    categoria = db.Column(db.String(80), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    orcamento = db.Column(db.Float, nullable=False)
    localizacao = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='Aberta')
    data_criacao = db.Column(db.DateTime, default=db.func.now())

    def __repr__(self):
        return f'<Demanda {self.titulo}>'
    
    # MÉTODO ESSENCIAL: Converte o objeto do BD para um dicionário JSON-friendly
    def to_dict(self):
        # Formata o orçamento para o padrão brasileiro no front-end
        orcamento_formatado = f"R$ {self.orcamento:,.2f}".replace(',', '_').replace('.', ',').replace('_', '.')
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'titulo': self.titulo,
            'subtitulo': self.subtitulo,
            'categoria': self.categoria,
            'descricao': self.descricao,
            'orcamento': orcamento_formatado, 
            'localizacao': self.localizacao,
            'status': self.status,
            'data_criacao': self.data_criacao.strftime("%Y-%m-%d %H:%M:%S")
        }

# ==============================================================================
# 3. FUNÇÕES UTILITÁRIAS
# ==============================================================================

def get_session_user_id():
    """Busca o ID do usuário na sessão, garantindo que seja um inteiro. Usa 1 como fallback."""
    user_id = session.get('user_id')
    try:
        return int(user_id) if user_id is not None else 1
    except ValueError:
        return 1

def parse_orcamento(orcamento_raw):
    """Limpa e converte a string de orçamento para float."""
    try:
        orcamento_str = str(orcamento_raw)
        # Remove 'R$' e substitui vírgula por ponto para conversão
        orcamento_limpo = orcamento_str.replace('R$', '').replace('.', '').replace(',', '.').strip()
        return float(orcamento_limpo)
    except ValueError:
        return 0.0

# ==============================================================================
# 4. ROTAS DE NAVEGAÇÃO E AUTENTICAÇÃO
# (Mantenha seu código original de login, cadastro, etc. aqui)
# ==============================================================================

# Rota Home (Página Index)
@app.route('/')
def index():
    is_logged_in = 'usuario_logado' in session
    if is_logged_in and 'user_id' not in session:
         session['user_id'] = 1
         
    return render_template('index.html', usuario_logado=is_logged_in)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'usuario_logado' in session:
        return redirect(url_for('index'))

    erro = None
    if request.method == 'POST':
        data = request.get_json(silent=True)
        
        if data:
            email = data.get('email')
            senha = data.get('senha')
            
            if email == 'usuario@teste.com' and senha == '123456':
                session['usuario_logado'] = True
                session['user_email'] = email 
                session['user_id'] = 1 
                return jsonify({
                    "mensagem": "Login bem-sucedido!", 
                    "access_token": "SIMULATED_TOKEN_123" 
                }), 200
            else:
                return jsonify({"erro": "Credenciais inválidas."}), 401
        
        else:
            email = request.form.get('email')
            senha = request.form.get('senha')
            
            if email == 'usuario@teste.com' and senha == '123456':
                session['usuario_logado'] = True
                session['user_email'] = email 
                session['user_id'] = 1 
                return redirect(url_for('index'))
            else:
                erro = 'Credenciais inválidas. Tente novamente.'
            
    return render_template('login.html', erro=erro) 

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data:
            email = data.get('email')
            
            session['usuario_logado'] = True
            session['user_email'] = email
            session['user_id'] = 1
            
            return jsonify({"mensagem": "Cadastro e Login bem-sucedidos!"}), 200
        else:
            email = request.form.get('email')
            
            session['usuario_logado'] = True
            session['user_email'] = email
            session['user_id'] = 1
            
            return redirect(url_for('index')) 
            
    return render_template('cadastro.html')

@app.route('/logout')
def logout():
    session.pop('usuario_logado', None)
    session.pop('user_email', None) 
    session.pop('user_id', None)
    return redirect(url_for('index'))

@app.route('/perfil')
def perfil():
    if 'usuario_logado' not in session:
        return redirect(url_for('login'))
        
    return render_template('perfil.html', user_email=session['user_email'])


# ==============================================================================
# 5. ROTAS DE API (CRUD COMPLETO DE DEMANDAS)
# ==============================================================================

# ROTA 5.1: CRIAÇÃO DE DEMANDA (POST /api/demandas)
@app.route('/api/demandas', methods=['POST'])
def criar_demanda():
    if 'usuario_logado' not in session:
        return jsonify({"erro": "Acesso negado. Por favor, faça login para criar uma demanda."}), 401

    try:
        data = request.get_json()
        cliente_id = get_session_user_id()
        
        titulo = data.get('titulo', 'Demanda sem título')
        subtitulo = data.get('subtitulo', '')
        categoria = data.get('categoria', 'outros')
        descricao = data.get('descricao', 'Nenhuma descrição fornecida.')
        localizacao = data.get('localizacao', 'Não informada')
        orcamento_float = parse_orcamento(data.get('orcamento', '0'))

        nova_demanda = Demanda(
            cliente_id=cliente_id,
            titulo=titulo,
            subtitulo=subtitulo,
            categoria=categoria,
            descricao=descricao,
            orcamento=orcamento_float, 
            localizacao=localizacao
        )
        
        db.session.add(nova_demanda)
        db.session.commit()
        
        return jsonify({
            "mensagem": "Demanda criada com sucesso!", 
            "id_demanda": nova_demanda.id,
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Erro detalhado ao criar demanda: {e}") 
        return jsonify({"erro": "Falha interna ao criar demanda."}), 500


# ROTA 5.2: LISTAGEM DE DEMANDAS DO USUÁRIO (GET /api/minhas_demandas) - FIX PARA O ERRO 404
@app.route('/api/minhas_demandas', methods=['GET'])
def minhas_demandas():
    if 'usuario_logado' not in session:
        return jsonify({"erro": "Acesso negado."}), 401

    cliente_id = get_session_user_id()

    try:
        # Busca as demandas ordenadas pela mais recente
        demanda_objects = Demanda.query.filter_by(cliente_id=cliente_id).order_by(Demanda.data_criacao.desc()).all()
        
        # Converte a lista de objetos Demanda para uma lista de dicionários
        demandas_do_usuario = [demanda.to_dict() for demanda in demanda_objects]
        
        return jsonify(demandas_do_usuario), 200
        
    except Exception as e:
        print(f"Erro ao buscar demandas para o cliente {cliente_id}: {e}")
        return jsonify({"erro": "Falha interna ao carregar demandas."}), 500


# ROTA 5.3: DETALHE, EDIÇÃO E EXCLUSÃO (GET, PUT, DELETE /api/demandas/<id>)
@app.route('/api/demandas/<int:demanda_id>', methods=['GET', 'PUT', 'DELETE'])
def gerenciar_demanda(demanda_id):
    if 'usuario_logado' not in session:
        return jsonify({"erro": "Acesso negado. Faça login."}), 401

    demanda = Demanda.query.get(demanda_id)
    if not demanda:
        return jsonify({"erro": "Demanda não encontrada."}), 404

    # Verifica se o usuário logado é o criador da demanda
    cliente_id = get_session_user_id()
    if demanda.cliente_id != cliente_id:
        return jsonify({"erro": "Não autorizado. Você não é o criador desta demanda."}), 403

    # Lógica de Edição (PUT)
    if request.method == 'PUT':
        try:
            data = request.get_json()
            
            # Atualiza os campos
            demanda.titulo = data.get('titulo', demanda.titulo)
            demanda.subtitulo = data.get('subtitulo', demanda.subtitulo)
            demanda.categoria = data.get('categoria', demanda.categoria)
            demanda.descricao = data.get('descricao', demanda.descricao)
            demanda.localizacao = data.get('localizacao', demanda.localizacao)
            
            # Atualiza orçamento de forma segura
            orcamento_novo = data.get('orcamento')
            if orcamento_novo is not None:
                 demanda.orcamento = parse_orcamento(orcamento_novo)
            
            db.session.commit()
            return jsonify({"mensagem": "Demanda atualizada com sucesso.", "id": demanda.id}), 200
        
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"erro": f"Falha no BD ao atualizar: {str(e)}"}), 500
        except Exception as e:
            return jsonify({"erro": f"Erro interno ao processar a atualização: {str(e)}"}), 500

    # Lógica de Exclusão (DELETE)
    elif request.method == 'DELETE':
        try:
            db.session.delete(demanda)
            db.session.commit()
            return jsonify({"mensagem": "Demanda excluída com sucesso."}), 200
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"erro": f"Falha no BD ao excluir: {str(e)}"}), 500
            
    # Lógica de Detalhe (GET - Para pré-preencher o formulário de edição)
    elif request.method == 'GET':
        return jsonify(demanda.to_dict()), 200
        
    return jsonify({"erro": "Método não permitido."}), 405


# ==============================================================================
# 6. EXECUÇÃO
# ==============================================================================

if __name__ == '__main__':
    with app.app_context():
        # Cria as tabelas do BD se elas não existirem
        db.create_all() 
    app.run(debug=True)