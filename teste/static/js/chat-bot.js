/* ====================== 5. CHAT ESTATICO ====================== */
document.addEventListener('DOMContentLoaded', function() {
    
    class ChatBot {
        constructor() {
            this.messageCount = 0;
            this.responses = ["Olá! 👋 Como posso ajudá-lo hoje?", "Entendi! Deixe-me verificar isso para você...", "Posso ajudar com informações sobre nossos produtos e serviços.", "Para questões mais específicas, posso conectá-lo com um atendente humano.", "Há mais alguma coisa em que posso ajudar?", "Obrigado por entrar em contato! Estou aqui sempre que precisar.", "Vou anotar sua solicitação e nossa equipe entrará em contato em breve.", "Essa é uma ótima pergunta! Vou buscar as informações mais atualizadas."];
            this.quickResponses = {'ola': 'Olá! Como posso ajudá-lo?', 'oi': 'Oi! Em que posso ser útil?', 'ajuda': 'Claro! Estou aqui para ajudar. O que você precisa?', 'produto': 'Temos vários produtos disponíveis. Sobre qual você gostaria de saber?', 'preço': 'Para informações sobre preços, posso conectá-lo com nossa equipe comercial.', 'contato': 'Você pode nos contatar através deste chat ou pelo email contato@empresa.com', 'horario': 'Nosso atendimento funciona 24/7 através deste chat!', 'obrigado': 'De nada! Fico feliz em ajudar! 😊'};
            this.init();
        }
        init() {
            this.bindEvents();
            // Verifica se o Bootstrap está carregado antes de instanciar o Collapse
            if (typeof bootstrap !== 'undefined' && document.getElementById('chatWidget')) {
                this.bootstrapCollapse = new bootstrap.Collapse(document.getElementById('chatWidget'), { toggle: false });
            }
        }
        bindEvents() {
            const supportButton = document.querySelector('#supportButton button');
            if (supportButton) supportButton.addEventListener('click', () => this.openChat());
            const closeButton = document.querySelector('#chatWidget .btn-light');
            if (closeButton) closeButton.addEventListener('click', () => this.closeChat());
            const sendMessageButton = document.getElementById('sendMessage');
            if (sendMessageButton) sendMessageButton.addEventListener('click', () => this.sendUserMessage());
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendUserMessage();
                });
            }
        }
        openChat() {
            if (this.bootstrapCollapse) {
                this.bootstrapCollapse.show();
                // Limpa o chat antes de começar
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) chatMessages.innerHTML = '<div class="text-muted small">Inicie uma conversa...</div>';
                this.messageCount = 0;

                setTimeout(() => this.addBotMessage("Olá! 👋 Bem-vindo ao nosso suporte! Como posso ajudá-lo hoje?"), 500);
                setTimeout(() => this.addBotMessage("Você pode me perguntar sobre nossos produtos, serviços ou qualquer dúvida que tiver!"), 1500);
            }
        }
        closeChat() {
            if (this.bootstrapCollapse) {
                this.bootstrapCollapse.hide();
                // Deixa a limpeza para o próximo 'openChat'
            }
        }
        sendUserMessage() {
            const input = document.getElementById('messageInput');
            if (!input) return;
            const message = input.value.trim();
            if (!message) return;
            this.addUserMessage(message);
            input.value = '';
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.generateBotResponse(message);
            }, 1000 + Math.random() * 1000);
        }
        addUserMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            if (chatMessages.querySelector('.text-muted.small')) {
                 chatMessages.innerHTML = '';
            }
            const div = document.createElement('div');
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex justify-content-end"><div class="bg-primary text-white rounded px-3 py-2" style="max-width: 80%">${message}</div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        addBotMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            if (chatMessages.querySelector('.text-muted.small')) {
                 chatMessages.innerHTML = '';
            }
            const div = document.createElement('div');
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex align-items-start mb-2"><div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2"><i class="bi bi-robot text-white"></i></div><div class="bg-light border rounded px-3 py-2" style="max-width: 80%">${message}</div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        showTypingIndicator() {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            const div = document.createElement('div');
            div.id = 'typingIndicator';
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex align-items-start mb-2"><div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2"><i class="bi bi-robot text-white"></i></div><div class="bg-light border rounded px-3 py-2"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        hideTypingIndicator() {
            const typing = document.getElementById('typingIndicator');
            if (typing) typing.remove();
        }
        generateBotResponse(userMsg) {
            const msg = userMsg.toLowerCase();
            let reply = this.quickResponses[msg] || this.responses[Math.floor(Math.random() * this.responses.length)];
            this.addBotMessage(reply);
            this.messageCount++;
            if (this.messageCount === 3) {
                setTimeout(() => this.addBotMessage("Se precisar de ajuda mais específica, posso conectá-lo com um atendente humano. Gostaria?"), 2000);
            }
        }
        scrollToBottom() {
            const container = document.getElementById('chatMessages');
            if (container) container.scrollTop = container.scrollHeight;
        }
    }
    
    // Inicializa o ChatBot
    new ChatBot();
});