/* ====================== 2. LÓGICA DE FILTRO DE CARDS ====================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // Variáveis definidas em utils-api-form.js (Verificadas e Corretas)
    const { 
        filterButtons, sectionDestaques, sectionMinhasDemandas, 
        sectionDisponiveis, containerBtnCriar, btnAbrirCriar, collapseForm
    } = window;

    // Se as variáveis globais não existirem, o código para aqui (erro de ordem)
    if (!filterButtons || !sectionDestaques || !sectionMinhasDemandas || !sectionDisponiveis) {
        console.error("Erro: Variáveis globais do filtro (IDs) não encontradas. Verifique utils-api-form.js e seu HTML.");
        return;
    }

    // Função central para alternar a visibilidade das seções
    window.updateSectionVisibility = function(targetId) {
        
        const allSections = [
            { element: sectionDestaques, id: 'destaques' },
            { element: sectionMinhasDemandas, id: 'minhas-demandas' },
            { element: sectionDisponiveis, id: 'disponiveis' }
        ];

        allSections.forEach(section => {
            if (section.id === targetId) {
                // APENAS REMOVE d-none para mostrar (O row já faz o layout)
                section.element.classList.remove('d-none');
            } else {
                // ADICIONA d-none para esconder
                section.element.classList.add('d-none');
            }
        });
        
        // Gerenciar o botão "Criar Nova Demanda" e fechar o form se for necessário
        if (targetId === 'minhas-demandas' && containerBtnCriar) {
            containerBtnCriar.classList.remove('d-none');
            
            // Re-renderiza a lista de demandas
            if (window.renderDemandas) {
                window.renderDemandas();
            }
            
        } else if (containerBtnCriar) {
            containerBtnCriar.classList.add('d-none');
            
            // Se o formulário de criação/edição estiver aberto, ele deve ser fechado
            if (collapseForm && collapseForm.classList.contains('show')) {
                // Simula o clique para fechar o collapse e disparar o resetForm
                if (btnAbrirCriar) btnAbrirCriar.click(); 
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

    // Inicialização: Garante que a seção "Destaques" esteja visível ao carregar
    window.updateSectionVisibility('destaques');
});