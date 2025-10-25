# backend/routers/profile.py - Rota para ativar o perfil Profissional/Cliente

from flask import Blueprint, request, jsonify
# Importa o modelo Profissional e a lista de usuários para simulação de BD
from domain.models import Profissional, usuarios_cadastrados

# Cria o Blueprint (Roteador) para as rotas de perfil
profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


@profile_bp.route('/professional', methods=['POST'])
def register_professional():
    # 1. Recebe os dados JSON do Frontend
    data = request.get_json()
    
    # 2. Extrai os campos necessários (id_usuario é crucial para vincular)
    user_id = data.get('id_usuario')
    titulo = data.get('titulo')
    habilidades = data.get('habilidades') # Esperamos uma lista ou string
    bio = data.get('bio', "")
    # Usa 0.0 como padrão se não for fornecido ou for nulo
    valor_honra = data.get('valor_honra', 0.0) 

    if not all([user_id, titulo]):
        return jsonify({"erro": "Campos obrigatórios (ID de Usuário, Título) ausentes."}), 400

    # 3. Localiza o Usuário Base (Simulando consulta ao BD)
    # Busca na lista global o usuário com o ID fornecido
    usuario_base = next((u for u in usuarios_cadastrados if u.id == user_id), None)

    if not usuario_base:
        return jsonify({"erro": "Usuário base não encontrado. ID inválido ou sessão expirada."}), 404
        
    if usuario_base.perfil_profissional:
        return jsonify({"erro": "Este usuário já possui um perfil profissional ativo."}), 409

    # 4. Cria a instância do novo Perfil Profissional
    try:
        # Garante que habilidades seja uma string, caso venha como lista do JS
        habilidades_str = ', '.join(habilidades) if isinstance(habilidades, list) else habilidades or ""
        
        # Converte o valor de honra para float, garantindo que a entrada seja tratada
        try:
            valor_honra_float = float(valor_honra)
        except ValueError:
            valor_honra_float = 0.0 # Define 0 se a conversão falhar
            
        novo_profissional = Profissional(
            id_usuario=user_id,
            titulo=titulo,
            habilidades=habilidades_str,
            valor_honra=valor_honra_float,
            bio=bio
        )
    except Exception as e:
         return jsonify({"erro": f"Falha ao criar o objeto Profissional: {str(e)}"}), 500


    # 5. Vincula o perfil Profissional ao Usuário Base na lista global
    usuario_base.perfil_profissional = novo_profissional
    
    # Exemplo de verificação do objeto na memória (opcional, apenas para debug)
    print(f"\n--- Novo Profissional Cadastrado (ID: {user_id}) ---")
    print(f"Título: {usuario_base.perfil_profissional.titulo}")
    print(f"Bio: {usuario_base.perfil_profissional.bio[:20]}...")
    print("---------------------------------------------------\n")

    # 6. Retorna o status de sucesso
    return jsonify({
        "mensagem": "Perfil Profissional criado e ativado com sucesso.",
        "id_usuario": user_id,
        "titulo": novo_profissional.titulo
    }), 201

# Futuramente, adicionaremos a rota para /client aqui