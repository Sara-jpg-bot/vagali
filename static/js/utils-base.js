// =================================================================
// js/utils-base.js: Constantes e Funções Auxiliares Globais
// =================================================================

// -----------------------------------------------------------------
// CONSTANTES DE URL
// -----------------------------------------------------------------
// A URL base para a sua API de Demandas (usada em scripts.js)
window.DEMANDAS_URL = 'http://127.0.0.1:5000/api/demandas'; 


// -----------------------------------------------------------------
// FUNÇÃO UTILITÁRIA: EXIBIR MENSAGENS (Alerts)
// -----------------------------------------------------------------
window.mostrarMensagem = function(message, type = 'info', duration = 5000) {
    // Cria um elemento de alerta Bootstrap
    const alertPlaceholder = document.getElementById('alert-placeholder') || document.body;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top-alert`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Adiciona uma área de placeholder se não existir
    if (!document.getElementById('alert-placeholder')) {
         const placeholder = document.createElement('div');
         placeholder.id = 'alert-placeholder';
         placeholder.style.position = 'fixed';
         placeholder.style.top = '20px';
         placeholder.style.right = '20px';
         placeholder.style.zIndex = '1050';
         document.body.appendChild(placeholder);
         alertPlaceholder = placeholder;
    }

    alertPlaceholder.appendChild(alertDiv);
    
    // Remove o alerta após a duração
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, duration);
};


// -----------------------------------------------------------------
// FUNÇÃO UTILITÁRIA: MAPEAR ÍCONES DE CATEGORIA (CORREÇÃO)
// -----------------------------------------------------------------
window.getCategoryIcon = function(category) {
    // Mapeia os nomes de categoria do seu formulário para ícones do Bootstrap Icons (bi)
    const map = {
        'eletricidade': { class: 'bi bi-lightning-fill', color: 'text-warning' },
        'hidraulica': { class: 'bi bi-droplet-fill', color: 'text-primary' },
        'pintura': { class: 'bi bi-paint-bucket', color: 'text-danger' },
        'jardinagem': { class: 'bi bi-tree-fill', color: 'text-success' },
        'reformas': { class: 'bi bi-tools', color: 'text-info' },
        // Garante que a classe 'bi' está sendo usada para o Bootstrap Icons
        'outros': { class: 'bi bi-question-circle-fill', color: 'text-muted' } 
    };
    
    // Retorna o mapeamento ou o ícone padrão 'outros'
    return map[category] || map['outros'];
};