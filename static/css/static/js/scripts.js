// =================================================================
// js/scripts.js: Lógica de Autenticação, Submissão de Form e Handlers de UI
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Referências de Elementos
    const demandaForm = document.getElementById('demandaForm');
    const categoriaSelect = document.getElementById('demanda-categoria');
    const iconPreview = document.getElementById('icon-preview');
    const collapseCriarDemanda = document.getElementById('collapseCriarDemanda');
    
    // Elementos do formulário de demanda
    const formTitle = document.getElementById('form-title'); 
    const btnSalvar = document.getElementById('btn-salvar-demanda');

    // Estado Global (ID da demanda que está sendo editada)
    window.currentEditingId = null; 

    // -----------------------------------------------------------------
    // LÓGICA DE CATEGORIA E ÍCONES
    // -----------------------------------------------------------------
    if (categoriaSelect && iconPreview) {
        categoriaSelect.addEventListener('change', () => {
            const selectedCategory = categoriaSelect.value;
            // Assumindo que window.getCategoryIcon está definido em utils-base.js
            const info = window.getCategoryIcon(selectedCategory); 
            iconPreview.className = `${info.class} ${info.color} fs-2`; // fs-2 é um bom tamanho para preview
        });
        // Dispara o evento para carregar o ícone inicial
        categoriaSelect.dispatchEvent(new Event('change')); 
    }

    // -----------------------------------------------------------------
    // FUNÇÕES DE GERENCIAMENTO DE FORMULÁRIO
    // -----------------------------------------------------------------
    function resetForm() {
        if (demandaForm) {
            demandaForm.reset();
        }
        if (iconPreview) {
             iconPreview.className = '';
        }
        window.currentEditingId = null; 
        if (formTitle) formTitle.textContent = 'Criar Nova Demanda';
        if (btnSalvar) btnSalvar.textContent = 'Criar Demanda';
        if (btnSalvar) btnSalvar.classList.remove('btn-warning');
        if (btnSalvar) btnSalvar.classList.add('btn-primary');
    }
    window.resetForm = resetForm; 

    if (collapseCriarDemanda) {
        // Reseta o form quando o modal de criação/edição é fechado
        collapseCriarDemanda.addEventListener('hidden.bs.collapse', resetForm);
    }

    // Função global para preencher o formulário no modo edição
    window.populateFormForEdit = function(demanda) {
        // Abre o formulário se estiver fechado
        if (collapseCriarDemanda && !collapseCriarDemanda.classList.contains('show')) {
             const bsCollapse = window.bootstrap?.Collapse.getInstance(collapseCriarDemanda) || new window.bootstrap.Collapse(collapseCriarDemanda, { toggle: false });
             bsCollapse.show();
        }

        // Preenche os campos
        document.getElementById('demanda-titulo').value = demanda.titulo || '';
        document.getElementById('demanda-subtitulo').value = demanda.subtitulo || ''; 
        document.getElementById('demanda-localizacao').value = demanda.localizacao || ''; 
        document.getElementById('demanda-descricao').value = demanda.descricao || '';
        document.getElementById('demanda-categoria').value = demanda.categoria || 'outros';
        
        // Trata a formatação do orçamento para que o campo de input aceite
        const orcamento_limpo = demanda.orcamento.toString().replace(/R\$\s*/, '').replace(/\./g, '').replace(/,/, '.');
        document.getElementById('demanda-orcamento').value = orcamento_limpo;
        
        // Atualiza o estado e a UI
        window.currentEditingId = demanda.id;
        if (formTitle) formTitle.textContent = 'Editar Demanda (ID: ' + demanda.id + ')';
        if (btnSalvar) btnSalvar.textContent = 'Salvar Alterações';
        if (btnSalvar) btnSalvar.classList.remove('btn-primary');
        if (btnSalvar) btnSalvar.classList.add('btn-warning');

        categoriaSelect.dispatchEvent(new Event('change'));
    };

    // -----------------------------------------------------------------
    // LÓGICA DE SUBMISSÃO DE DEMANDA (POST/PUT)
    // -----------------------------------------------------------------
    if (demandaForm && typeof window.DEMANDAS_URL !== 'undefined') {
        demandaForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            const isEditing = window.currentEditingId !== null;
            
            btnSalvar.disabled = true;
            btnSalvar.textContent = isEditing ? 'Atualizando...' : 'Enviando...';

            // Limpa e prepara o orçamento
            const orcamentoRaw = document.getElementById('demanda-orcamento').value;
            const orcamentoLimpo = orcamentoRaw.replace(/R\$\s*/, '').replace(/\./g, '').replace(/,/, '.');

            const dadosDemanda = {
                titulo: document.getElementById('demanda-titulo').value,
                subtitulo: document.getElementById('demanda-subtitulo').value,
                categoria: categoriaSelect.value,
                descricao: document.getElementById('demanda-descricao').value,
                orcamento: orcamentoLimpo, 
                localizacao: document.getElementById('demanda-localizacao').value,
            };
            
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${window.DEMANDAS_URL}/${window.currentEditingId}` : window.DEMANDAS_URL;
            
            try {
                const response = await fetch(url, { 
                    method: method, 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosDemanda),
                });
                
                const resultado = await response.json().catch(() => ({})); 

                if (response.ok) {
                    
                    if (typeof window.renderDemandas === 'function') {
                         window.renderDemandas(); // RECARREGA OS CARDS (CHAMADA VITORIOSA!)
                    }
                    
                    // Lógica para forçar a visualização da aba Minhas Demandas
                    const demandasSection = document.getElementById('section-minhas-demandas');
                    const destaquesSection = document.getElementById('destaques');
                    const disponiveisSection = document.getElementById('disponiveis');
                    const minhasDemandasButton = document.querySelector('[data-target="minhas-demandas"]');
                    
                    if (demandasSection && minhasDemandasButton) {
                        demandasSection.classList.remove('d-none');
                        destaquesSection?.classList.add('d-none');
                        disponiveisSection?.classList.add('d-none');
                        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                        minhasDemandasButton.classList.add('active');
                    }

                    const successMsg = isEditing ? 'Demanda atualizada com sucesso!' : 'Demanda criada com sucesso!';
                    window.mostrarMensagem(successMsg, 'success'); 
                    
                    if (collapseCriarDemanda) {
                         const bsCollapse = window.bootstrap?.Collapse.getInstance(collapseCriarDemanda) || new window.bootstrap.Collapse(collapseCriarDemanda, { toggle: false });
                         bsCollapse.hide(); 
                    } else {
                         resetForm(); 
                    }
                    
                } else {
                    const action = isEditing ? 'atualizar' : 'criar';
                    const errorMessage = resultado.erro || `Erro desconhecido ao ${action} demanda.`;
                    window.mostrarMensagem(`Erro: ${errorMessage}`, 'danger');
                }
                
            } catch (error) {
                window.mostrarMensagem('Falha na comunicação com o servidor. Verifique a conexão.', 'warning');
                console.error('Erro de Fetch:', error);
            } finally {
                if (btnSalvar) {
                    btnSalvar.disabled = false;
                    const isEditing = window.currentEditingId !== null;
                    btnSalvar.textContent = isEditing ? 'Salvar Alterações' : 'Criar Demanda';
                }
            }
        });
    } else {
        console.error("demandaForm ou DEMANDAS_URL não encontrados. Verifique o HTML e o utils-base.js.");
    }
    
    // -----------------------------------------------------------------
    // FUNÇÕES GLOBAIS DE MANIPULAÇÃO DE DEMANDAS (HANDLERS DOS BOTÕES)
    // -----------------------------------------------------------------

    window.handleEditarDemanda = async function(id) {
        if (!id) return;
        
        try {
            const response = await fetch(`${window.DEMANDAS_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Demanda não encontrada.');
            }
            const demanda = await response.json();
            
            // Chama a função para preencher e abrir o formulário
            if (typeof window.populateFormForEdit === 'function') {
                window.populateFormForEdit(demanda);
            }
            
        } catch (error) {
            window.mostrarMensagem(`Erro ao buscar demanda para edição: ${error.message}`, 'danger');
            console.error(error);
        }
    };

    window.handleExcluirDemanda = async function(id) {
        if (!id || !confirm(`Tem certeza que deseja excluir a demanda ID ${id}?`)) {
            return;
        }
        
        try {
            const url = `${window.DEMANDAS_URL}/${id}`;
            
            const response = await fetch(url, { 
                method: 'DELETE'
            });
            
            if (response.ok) {
                window.mostrarMensagem(`Demanda ID ${id} excluída com sucesso!`, 'success');
                
                // Recarrega os cards após a exclusão
                if (typeof window.renderDemandas === 'function') {
                    window.renderDemandas();
                }
            } else {
                const resultado = await response.json().catch(() => ({})); 
                const errorMessage = resultado.erro || 'Erro desconhecido ao excluir demanda.';
                window.mostrarMensagem(`Erro ao excluir: ${errorMessage}`, 'danger');
            }
            
        } catch (error) {
            window.mostrarMensagem('Falha na comunicação com o servidor ao excluir.', 'warning');
            console.error('Erro de Fetch DELETE:', error);
        }
    };
    
    // -----------------------------------------------------------------
    // LÓGICA DE FILTRO DE ABAS (MANTIDO)
    // -----------------------------------------------------------------
    
    // Inicializa a renderização se a aba for 'minhas-demandas' ao carregar
    const initialActiveButton = document.querySelector('.btn-filter.active');
    if (initialActiveButton && initialActiveButton.dataset.target === 'minhas-demandas') {
        if (typeof window.renderDemandas === 'function') {
             window.renderDemandas(); 
        }
    }
    
    document.querySelectorAll('.btn-filter').forEach(button => {
        button.addEventListener('click', (event) => {
            // Remove 'active' de todos e adiciona ao clicado
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            event.currentTarget.classList.add('active');
            
            const target = event.currentTarget.dataset.target;
            
            // Esconde todas as seções
            document.getElementById('destaques')?.classList.add('d-none');
            document.getElementById('section-minhas-demandas')?.classList.add('d-none');
            document.getElementById('disponiveis')?.classList.add('d-none');

            // Exibe a seção correta e executa a função de renderização se for "Minhas Demandas"
            if (target === 'destaques') {
                document.getElementById('destaques')?.classList.remove('d-none');
            } else if (target === 'minhas-demandas') {
                const container = document.getElementById('section-minhas-demandas');
                if (container) {
                    container.classList.remove('d-none');
                    if (typeof window.renderDemandas === 'function') {
                         window.renderDemandas();
                    }
                }
            } else if (target === 'disponiveis') {
                document.getElementById('disponiveis')?.classList.remove('d-none');
            }
        });
    });

});