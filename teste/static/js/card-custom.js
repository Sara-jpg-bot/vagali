document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção de Elementos de Filtro
    const filterButtons = document.querySelectorAll('.btn-filter');
    const sections = document.querySelectorAll('.cards-section');
    const btnCriarDemandaContainer = document.getElementById('container-btn-criar');

    // 2. Seleção de Elementos do Formulário
    const demandaForm = document.getElementById('demandaForm');
    const sectionMinhasDemandas = document.getElementById('section-minhas-demandas');

    // --- FUNÇÕES DE FILTRO E VISIBILIDADE ---

    /**
     * Alterna o estado ativo dos botões e a visibilidade das seções usando classes do Bootstrap (d-none).
     */
    const handleFilterClick = (button) => {
        const baseTargetId = button.getAttribute('data-target');
        const targetId = `section-${baseTargetId}`; // Cria o ID completo (ex: 'section-destaques')

        // 2.1. Gerencia a classe 'active' nos botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active'); 

        // 2.2. Gerencia a visibilidade das seções (COM CORREÇÃO DE LAYOUT)
        sections.forEach(section => {
            // Esconde TODAS as seções adicionando a classe d-none
            section.classList.add('d-none');
            // Limpa as classes de display para evitar conflitos de layout (IMPORTANTE)
            section.classList.remove('d-flex', 'd-grid', 'd-block');

            // Mostra APENAS a seção alvo
            if (section.id === targetId) {
                // Remove a classe d-none para mostrar
                section.classList.remove('d-none');
                
                // RESTAURAÇÃO DO LAYOUT:
                // Como suas seções usam 'row g-4', o display correto do Bootstrap para rows é 'flex'.
                section.classList.add('d-flex'); 
            }
        });

        // 2.3. Lógica para o botão "Criar Nova Demanda"
        if (btnCriarDemandaContainer) {
             if (targetId === 'section-minhas-demandas') {
                btnCriarDemandaContainer.classList.remove('d-none');
            } else {
                btnCriarDemandaContainer.classList.add('d-none');
            }
        }
    };

    // 3. Adiciona o listener de clique a cada botão de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleFilterClick(button));
    });

    // 4. Inicializa o estado
    const initialActiveButton = document.querySelector('.btn-filter.active');
    if (initialActiveButton) {
        handleFilterClick(initialActiveButton);
    } else if (filterButtons.length > 0) {
        handleFilterClick(filterButtons[0]);
    }

    // --- FUNÇÕES DE CRIAÇÃO E SALVAMENTO DE CARD ---

    /**
     * Gera o HTML de um novo card de Demanda.
     */
    const createDemandaCardHTML = (dados) => {
        let iconClass = 'bi-tools'; 
        let iconColor = 'text-primary';
        
        switch (dados.categoria) {
            case 'eletricidade': iconClass = 'bi-lightning-fill'; iconColor = 'text-warning'; break;
            case 'hidraulica': iconClass = 'bi-droplet-fill'; iconColor = 'text-info'; break;
            case 'pintura': iconClass = 'bi-paint-bucket'; iconColor = 'text-danger'; break;
            case 'jardinagem': iconClass = 'bi-tree-fill'; iconColor = 'text-success'; break;
            default: iconClass = 'bi-tools'; break;
        }

        // O card TEM que ter as classes de coluna (col-lg-3 etc.) para se alinhar ao 'row g-4'!
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 col-12 new-demanda-card">
                <div class="card card-perfil shadow-sm p-3 flex-fill h-100">
                    <div class="d-flex align-items-center mb-3">
                        <i class="bi ${iconClass} fs-4 me-3 ${iconColor}"></i>
                        <div>
                            <h6 class="text-uppercase fw-bold mb-0">${dados.titulo}</h6>
                            <p class="mb-0 fw-semibold">${dados.subtitulo}</p>
                            <p class="text-muted small mb-1">${dados.localizacao}</p>
                        </div>
                    </div>
                    <p class="small mb-2 description-text">${dados.descricao.substring(0, 100)}... <a href="#">ler mais...</a></p>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <div class="price-info">
                            <span class="fw-bold me-2">Orçamento:</span>
                            <span>${dados.orcamento}</span>
                        </div>
                        <span class="badge bg-secondary">Aberto</span>
                    </div>
                </div>
            </div>
        `;
    };

    /**
     * Ouve o envio do formulário, cria o card e o insere no DOM.
     */
    if (demandaForm && sectionMinhasDemandas) {
        demandaForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            e.stopImmediatePropagation(); // Garante que apenas este handler seja executado

            // 1. Força a ativação da seção "Minhas Demandas" para garantir que o card apareça
            const btnMinhasDemandas = document.querySelector('[data-target="minhas-demandas"]');
            if (btnMinhasDemandas) {
                handleFilterClick(btnMinhasDemandas);
            }

            // 2. Captura os dados
            const dadosDemanda = {
                titulo: document.getElementById('demanda-titulo').value || 'Demanda Sem Título',
                subtitulo: document.getElementById('demanda-subtitulo').value || 'Nova Demanda',
                categoria: document.getElementById('demanda-categoria').value,
                descricao: document.getElementById('demanda-descricao').value || 'Nenhuma descrição fornecida.',
                orcamento: document.getElementById('demanda-orcamento').value || 'R$ 0,00',
                localizacao: document.getElementById('demanda-localizacao').value || 'Localização não informada'
            };

            // 3. Insere o card no topo da seção
            const novoCardHTML = createDemandaCardHTML(dadosDemanda);
            sectionMinhasDemandas.insertAdjacentHTML('afterbegin', novoCardHTML);

            // 4. Limpa e fecha o formulário
            demandaForm.reset();
            const collapseElement = document.getElementById('collapseCriarDemanda');
            if (collapseElement && window.bootstrap && bootstrap.Collapse) {
                const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    new bootstrap.Collapse(collapseElement, { toggle: false }).hide();
                }
            }

            alert('Nova demanda criada com sucesso!');
        });
    }
});