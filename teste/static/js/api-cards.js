// =================================================================
// js/api-cards.js: Lógica de Renderização e Interação de Cards
// =================================================================

// Define a URL da API de Minhas Demandas
const MINHAS_DEMANDAS_URL = 'http://127.0.0.1:5000/api/minhas_demandas'; 

// -----------------------------------------------------------------
// FUNÇÃO AUXILIAR: CRIA O ELEMENTO CARD HTML
// -----------------------------------------------------------------
function createCardElement(demanda) {
    // 1. Obtém informações de ícone e cor (Assumindo que getCategoryIcon está em utils-base.js)
    const categoryInfo = (typeof window.getCategoryIcon === 'function') 
        ? window.getCategoryIcon(demanda.categoria) 
        : { class: 'bi bi-question-circle', color: 'text-muted' };
        
    const iconClass = categoryInfo.class;
    const iconColor = categoryInfo.color;
    
    // Formata o orçamento para exibição
    const orcamentoFormatado = parseFloat(demanda.orcamento).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    // O elemento principal do card é uma coluna (col)
    const colDiv = document.createElement('div');
    // **Corrigido:** Garantimos as classes de coluna para o layout
    colDiv.className = 'col-lg-3 col-md-4 col-sm-6 col-12 mb-4';

    colDiv.innerHTML = `
        <div class="card card-demanda shadow-sm p-3 flex-fill h-100">
            
            <div class="card-header d-flex justify-content-between align-items-center bg-white border-0 pt-0 pb-2">
                <span class="badge rounded-pill text-bg-secondary">${demanda.status || 'ABERTA'}</span>
                <i class="${iconClass} fs-3 ${iconColor}"></i>
            </div>
            
            <div class="card-body p-0 pb-3">
                <h6 class="text-uppercase fw-bold mb-0">${demanda.titulo}</h6>
                <p class="mb-0 fw-semibold">${demanda.subtitulo}</p>
                <p class="text-muted small mb-2">${demanda.localizacao}</p>
                <p class="small description-text">${demanda.descricao} <a href="#" data-id="${demanda.id}" class="btn-read-more">ler mais...</a></p>
            </div>
            
            <div class="card-footer d-flex justify-content-between align-items-center bg-white border-0 p-0 pt-2">
                <div class="price-info">
                    <span class="fw-bold me-2">Orçamento:</span>
                    <span>${orcamentoFormatado}</span>
                </div>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-warning btn-edit" data-id="${demanda.id}" title="Editar Demanda">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="${demanda.id}" title="Excluir Demanda">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return colDiv;
}


// -----------------------------------------------------------------
// LÓGICA DE CLIQUE E LISTENERS (PARA BOTÕES)
// -----------------------------------------------------------------

// Função que anexa os ouvintes aos botões de cada card
function attachCardEventListeners() {
    // Listener para o botão Editar
    document.querySelectorAll('.btn-edit').forEach(button => {
        // Remove listeners antigos para evitar duplicação (boas práticas)
        button.removeEventListener('click', handleCardClick); 
        button.addEventListener('click', handleCardClick);
    });

    // Listener para o botão Excluir
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.removeEventListener('click', handleCardClick); 
        button.addEventListener('click', handleCardClick);
    });
    
    // Adiciona outros listeners (ex: "ler mais...")
    // document.querySelectorAll('.btn-read-more').forEach(button => { ... });
}


// Função de tratamento de clique dos botões (Chama o handler principal no scripts.js)
function handleCardClick(event) {
    event.stopPropagation(); // Evita cliques indesejados no card se for um link pai
    
    const id = event.currentTarget.dataset.id;
    const isEdit = event.currentTarget.classList.contains('btn-edit');
    
    if (isEdit) {
        if (typeof window.handleEditarDemanda === 'function') {
            window.handleEditarDemanda(id);
        } else {
            console.error("Função handleEditarDemanda não está definida.");
        }
    } else { // Deve ser delete
        if (typeof window.handleExcluirDemanda === 'function') {
            window.handleExcluirDemanda(id);
        } else {
            console.error("Função handleExcluirDemanda não está definida.");
        }
    }
}


// -----------------------------------------------------------------
// FUNÇÃO PRINCIPAL: RENDERIZAR DEMANDAS
// -----------------------------------------------------------------

window.renderDemandas = async function() {
    const demandasContainer = document.getElementById('section-minhas-demandas');

    if (!demandasContainer || typeof MINHAS_DEMANDAS_URL === 'undefined') {
        console.error("Contêiner de demandas ou URL não encontrados. Renderização abortada.");
        return;
    }
    
    console.log(`Executando renderDemandas(). URL: ${MINHAS_DEMANDAS_URL}`);
    
    try {
        demandasContainer.innerHTML = '<p class="text-center text-primary mt-5">Carregando suas demandas...</p>';
        
        const response = await fetch(MINHAS_DEMANDAS_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const demandas = await response.json();
        
        // 1. Limpa o contêiner
        demandasContainer.innerHTML = ''; 

        if (demandas.length === 0) {
            demandasContainer.innerHTML = '<p class="text-center text-muted mt-5">Você ainda não criou nenhuma demanda.</p>';
            return;
        }

        // 2. Cria e anexa os cards
        demandas.forEach(demanda => {
            const cardElement = createCardElement(demanda);
            // **Corrigido:** Anexa DIRETAMENTE ao container que já é uma "row"
            demandasContainer.appendChild(cardElement); 
        });

        // 3. Anexa os Event Listeners (CRÍTICO para Editar/Excluir)
        attachCardEventListeners();
        
    } catch (error) {
        console.error("Falha ao carregar demandas:", error);
        demandasContainer.innerHTML = '<p class="text-center text-danger mt-5">Erro ao carregar demandas. Tente novamente mais tarde.</p>';
    }
};