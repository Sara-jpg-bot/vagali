// =================================================================
// js/filtro.js: Lógica de Filtro de Abas e Visibilidade de UI
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos e variáveis que devem estar definidos no HTML/DOM
    const filterButtons = document.querySelectorAll('.btn-filter');
    const sectionMinhasDemandas = document.getElementById('section-minhas-demandas'); 
    const containerBtnCriar = document.getElementById('container-btn-criar');
    const collapseForm = document.getElementById('collapseCriarDemanda');
    const btnAbrirCriar = document.getElementById('btnCriarDemanda'); 

    // Seleção de todas as seções de cards
    const allSections = document.querySelectorAll('.cards-section');

    // Função central para alternar a visibilidade das seções
    window.updateSectionVisibility = function(targetId) {
        
        allSections.forEach(section => {
            const sectionBaseId = section.id.replace('section-', '');
            
            if (sectionBaseId === targetId) {
                // Mostra a seção (remove d-none e restaura d-flex para rows)
                section.classList.remove('d-none');
                section.classList.add('d-flex'); 
            } else {
                // Esconde a seção
                section.classList.add('d-none');
                section.classList.remove('d-flex');
            }
        });
        
        // Gerenciar o botão "Criar Nova Demanda" e fechar o form se for necessário
        if (targetId === 'minhas-demandas' && containerBtnCriar) {
            containerBtnCriar.classList.remove('d-none');
            
            // CHAMADA CRÍTICA: Força o carregamento da lista do servidor
            if (window.renderDemandas) {
                window.renderDemandas();
            }
            
        } else if (containerBtnCriar) {
            containerBtnCriar.classList.add('d-none');
            
            // Se o formulário de criação/edição estiver aberto, ele deve ser fechado
            if (collapseForm && collapseForm.classList.contains('show')) {
                 // Usa a lógica do Bootstrap para fechar o collapse
                if (window.bootstrap && bootstrap.Collapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(collapseForm) || new bootstrap.Collapse(collapseForm, { toggle: false });
                    bsCollapse.hide();
                }
            }
        }
    }

    // Adicionar Event Listeners aos botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;

            // Desativa a classe 'active' de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Ativa a classe 'active' no botão clicado (efeito visual)
            this.classList.add('active');

            // Troca a seção
            window.updateSectionVisibility(targetId);
        });
    });

    // Inicialização: Garante que a primeira seção ativa esteja visível ao carregar
    const initialActiveButton = document.querySelector('.btn-filter.active');
    if (initialActiveButton) {
         window.updateSectionVisibility(initialActiveButton.dataset.target);
    } else if (filterButtons.length > 0) {
        // Se nenhum estiver ativo, ativa o primeiro
        filterButtons[0].classList.add('active');
        window.updateSectionVisibility(filterButtons[0].dataset.target);
    }
});