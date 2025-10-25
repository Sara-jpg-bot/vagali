document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel-custom');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.img-slide'));
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    // Verifica se todos os elementos necessários foram encontrados antes de prosseguir
    if (!track || slides.length === 0 || !prevButton || !nextButton) {
        console.error("Carrossel customizado: Elementos essenciais não encontrados. Verifique IDs e classes no HTML.");
        return;
    }

    let currentIndex = 4; // Índice inicial, deve ser o do slide com 'destaque-mid'
    let slideWidth = 0; 
    const GAP = 20; // Deve ser igual ao definido no CSS: gap: 20px;
    
    let autoplayInterval; 
    const AUTOPLAY_TIME = 4000; 

    // --- Funções de Cálculo e Movimento ---

    const getSlideWidth = () => {
        // Encontra o primeiro slide NÃO destaque ou usa o primeiro como fallback
        const baseSlide = slides.find(slide => !slide.classList.contains('destaque-mid')) || slides[0];
        if (baseSlide) {
            slideWidth = baseSlide.offsetWidth;
        } else {
            // Valor de fallback para o CSS padrão
            slideWidth = 250; 
        }
        return slideWidth;
    };

    const updateCarousel = () => {
        getSlideWidth(); 

        const centerOffset = carousel.offsetWidth / 2;
        
        // 1. Calcula o total de largura até o slide anterior ao destaque (currentIndex)
        let targetX = 0;
        for (let i = 0; i < currentIndex; i++) {
            targetX += slides[i].offsetWidth + GAP;
        }
        
        // 2. Calcula o valor de translação para CENTRALIZAR o slide destaque (currentIndex)
        const destaqueWidth = slides[currentIndex].offsetWidth; 
        const newTransformValue = targetX - centerOffset + (destaqueWidth / 2);

        track.style.transform = `translateX(${-newTransformValue}px)`;

        // Gerencia a classe de destaque (CSS)
        slides.forEach((slide, index) => {
            slide.classList.remove('destaque-mid');
        });
        slides[currentIndex].classList.add('destaque-mid');
    };

    // --- Funções de Navegação com LOOP ---
    
    const moveToNextSlide = () => {
        // Implementa o LOOP para o próximo slide
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    };

    const moveToPrevSlide = () => {
        // Implementa o LOOP para o slide anterior
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateCarousel();
    };

    // --- Funções de Autoplay ---

    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(moveToNextSlide, AUTOPLAY_TIME);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // --- Inicialização e Listeners ---

    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };
    
    // 1. Adiciona Listeners de Clique
    prevButton.addEventListener('click', () => {
        moveToPrevSlide();
        resetAutoplay(); 
    });
    nextButton.addEventListener('click', () => {
        moveToNextSlide();
        resetAutoplay(); 
    });
    
    // 2. Adiciona Pausa ao Passar o Mouse
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // 3. Atualiza na Mudança de Tamanho da Janela
    window.addEventListener('resize', updateCarousel);
    
    // 4. Inicia o carrossel APÓS O CARREGAMENTO COMPLETO DA JANELA
    // 🚨 Esta é a correção crucial para garantir que as larguras (offsetWidth) estejam corretas.
    window.onload = () => {
        updateCarousel(); 
        startAutoplay(); 
    };

    // Chama updateCarousel() imediatamente, mas o window.onload garantirá a correção final
    updateCarousel(); 
});