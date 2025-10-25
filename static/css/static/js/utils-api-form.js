/* ====================== 1. UTILS E VARIÁVEIS GLOBAIS ====================== */

// Variáveis globais para o estado do CRUD
window.demandas = []; // Array que armazena os dados do localStorage
window.isEditing = false;
window.currentEditingIndex = -1;

// Mapeamento de ícones do Bootstrap Icons para as categorias
window.ICON_MAP = {
    'eletricidade': 'bi bi-lightning-fill',
    'hidraulica': 'bi bi-water',
    'pintura': 'bi bi-paint-bucket',
    'jardinagem': 'bi bi-tree',
    'reformas': 'bi bi-tools',
    'outros': 'bi bi-gear'
};

document.addEventListener('DOMContentLoaded', function() {
    // 1. Elementos do Filtro
    window.filterButtons = Array.from(document.querySelectorAll('.btn-filter'));
    window.sectionDestaques = document.getElementById('destaques'); // USAR O ID CORRIGIDO
    window.sectionMinhasDemandas = document.getElementById('minhas-demandas'); // USAR O ID CORRIGIDO
    window.sectionDisponiveis = document.getElementById('disponiveis'); // USAR O ID CORRIGIDO
    window.containerBtnCriar = document.getElementById('container-btn-criar');

    // 2. Elementos do Formulário (CRUD)
    window.demandaForm = document.getElementById('demandaForm');
    window.btnAbrirCriar = document.getElementById('btn-abrir-criar-demanda');
    window.collapseForm = document.getElementById('collapseCriarDemanda');
    window.selectCategoria = document.getElementById('demanda-categoria');
    window.inputOrcamento = document.getElementById('demanda-orcamento');

    // 3. Funções de Utilitário para Formulário

    // Função para resetar o formulário
    window.resetForm = function() {
        if (!window.demandaForm || !window.selectCategoria) return;

        window.demandaForm.reset();
        window.isEditing = false;
        window.currentEditingIndex = -1;
        
        // Reseta os textos
        const formTitle = document.getElementById('form-title');
        const btnSalvar = document.getElementById('btn-salvar-demanda');
        const iconPreview = document.getElementById('icon-preview');

        if (formTitle) formTitle.textContent = 'Criar Nova Demanda';
        if (btnSalvar) btnSalvar.textContent = 'Criar Demanda';
        if (iconPreview) iconPreview.className = 'fs-2 text-primary';
    };

    // Adiciona o evento de 'hidden.bs.collapse' para resetar o form
    if (window.collapseForm) {
        window.collapseForm.addEventListener('hidden.bs.collapse', window.resetForm);
    }
    
    // Adiciona o evento para mostrar o ícone na pré-visualização
    if (window.selectCategoria) {
        window.selectCategoria.addEventListener('change', function() {
            const iconPreview = document.getElementById('icon-preview');
            const selectedIconClass = window.ICON_MAP[this.value] || window.ICON_MAP['outros'];
            if (iconPreview) iconPreview.className = `${selectedIconClass} fs-2 text-primary`;
        });
    }

    // Adiciona formatação de moeda ao campo Orçamento
    if (window.inputOrcamento) {
        window.inputOrcamento.addEventListener('input', function(e) {
            let value = e.target.value;
            value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
            if (value === "") {
                e.target.value = "";
                return;
            }
            
            // Converte para centavos e depois para Real
            let floatValue = parseFloat(value) / 100;
            e.target.value = "R$ " + floatValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        });
    }

    // Chama o resetForm na inicialização para garantir o estado padrão
    window.resetForm();
});