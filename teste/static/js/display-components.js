// =================================================================================
// 🚨 NOVO: URL BASE DA API (APONTA PARA O SEU SERVIDOR FLASK LOCAL)
// =================================================================================
const API_URL = 'http://127.0.0.1:5000/api';

/* ==================== 2. CARROSSEL, GALERIA E LOGIN ==================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica de Carrossel (Mantida) ---
    const track = document.querySelector('.carousel-track');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    if (track && prevButton && nextButton) {
        let slides = Array.from(document.querySelectorAll('.img-slide'));
        let currentIndex = 2; // Índice inicial do slide central

        function updateCarousel() {
             slides.forEach(slide => { slide.classList.remove('destaque-mid'); });
             slides[currentIndex].classList.add('destaque-mid');
             const containerWidth = track.parentElement.offsetWidth;
             const middleImage = slides[currentIndex];
             const middleImageWidth = middleImage.offsetWidth;
             const totalPreviousWidth = slides.slice(0, currentIndex).reduce((acc, img) => acc + img.offsetWidth, 0);
             const totalPreviousMargin = currentIndex * 20; // Assumindo 20px de gap
             const offset = (containerWidth / 2) - (middleImageWidth / 2) - totalPreviousWidth - totalPreviousMargin;
             track.style.transform = `translateX(${offset}px)`;
        }
        // ... (handleNext, handlePrev, Listeners - Ações mantidas) ...

        function handleNext() {
            track.style.transition = 'transform 0.6s ease-in-out';
            currentIndex++;
            updateCarousel();
            if (currentIndex > slides.length - 3) {
                setTimeout(() => { track.style.transition = 'none'; currentIndex = 2; updateCarousel(); }, 600);
            }
        }
        
        function handlePrev() {
            track.style.transition = 'transform 0.6s ease-in-out';
            currentIndex--;
            updateCarousel();
            if (currentIndex < 2) {
                setTimeout(() => { track.style.transition = 'none'; currentIndex = slides.length - 3; updateCarousel(); }, 600);
            }
        }

        nextButton.addEventListener('click', handleNext);
        prevButton.addEventListener('click', handlePrev);
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }
    
    // --- Lógica de Galeria (Mantida) ---
    const productGallery = document.getElementById('productGallery');
    const galleryPagination = document.getElementById('galleryPagination');
    // ... (restante da lógica de galeria, renderGallery, updatePagination, listeners) ...
    const galleries = [
        ['images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg'],
        ['images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg']
    ];
    let currentGalleryIndex = 0;

    if (productGallery || galleryPagination) {
        function renderGallery(index) {
             if (!productGallery) return;
             productGallery.innerHTML = '';
             const imagesToLoad = galleries[index];
             if (!imagesToLoad) return;
             imagesToLoad.forEach(imagePath => {
                 const colDiv = document.createElement('div');
                 colDiv.className = 'col-lg-4 col-md-4 col-6 mb-4'; 
                 const img = document.createElement('img');
                 img.src = imagePath;
                 img.alt = 'Imagem da galeria';
                 img.className = 'img-fluid rounded';
                 colDiv.appendChild(img);
                 productGallery.appendChild(colDiv);
             });
             updatePagination(index);
        }

        function updatePagination(activeIndex) {
             if (!galleryPagination) return;
             const pageItems = galleryPagination.querySelectorAll('.page-item');
             pageItems.forEach(item => { item.classList.remove('active'); });
             const currentPageItem = galleryPagination.querySelector(`[data-page="${activeIndex + 1}"]`);
             if (currentPageItem) currentPageItem.classList.add('active');
             const prevArrow = galleryPagination.querySelector('[data-page="prev"]');
             const nextArrow = galleryPagination.querySelector('[data-page="next"]');
             if (prevArrow) prevArrow.classList.toggle('disabled', activeIndex === 0);
             if (nextArrow) nextArrow.classList.toggle('disabled', activeIndex === galleries.length - 1);
        }

        if (galleryPagination) {
             galleryPagination.addEventListener('click', function(event) {
                 const target = event.target.closest('.page-item');
                 if (!target || target.classList.contains('active') || target.classList.contains('disabled')) return;
                 const pageData = target.dataset.page;
                 if (pageData === 'prev') {
                     if (currentGalleryIndex > 0) { currentGalleryIndex--; renderGallery(currentGalleryIndex); }
                 } else if (pageData === 'next') {
                     if (currentGalleryIndex < galleries.length - 1) { currentGalleryIndex++; renderGallery(currentGalleryIndex); }
                 } else {
                     const pageNumber = parseInt(pageData);
                     if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= galleries.length) {
                         currentGalleryIndex = pageNumber - 1;
                         renderGallery(currentGalleryIndex);
                     }
                 }
             });
             renderGallery(currentGalleryIndex);
        }
    }

    // --- Lógica de Login/Cadastro (Mantida) ---
    const loginFormContainer = document.getElementById('loginForm');
    const cadastroFormContainer = document.getElementById('cadastroForm');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showCadastroBtn = document.getElementById('showCadastroBtn');
    const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

    // ... (restante da lógica de login/cadastro, showLogin, showCadastro, etc.) ...
    if (loginFormContainer || cadastroFormContainer || showLoginBtn || showCadastroBtn) {

        function showLogin() {
             if (cadastroFormContainer) cadastroFormContainer.style.display = 'none';
             if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';
             if (loginFormContainer) {
                 loginFormContainer.style.display = 'block';
                 loginFormContainer.classList.add('fade-in');
             }
        }

        function showCadastro() {
             if (loginFormContainer) loginFormContainer.style.display = 'none';
             if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';
             if (cadastroFormContainer) {
                 cadastroFormContainer.style.display = 'block';
                 cadastroFormContainer.classList.add('fade-in');
             }
        }

        if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);
        if (showCadastroBtn) showCadastroBtn.addEventListener('click', showCadastro);
        
        if (loginFormContainer) {
             const formLogin = loginFormContainer.querySelector('form');
             if (formLogin) {
                 formLogin.addEventListener('submit', async function(event) {
                      event.preventDefault();
                      const email = document.getElementById('loginEmail').value;
                      alert(`Login simulado realizado com sucesso!\nE-mail: ${email}`);
                 });
             }
        }

        if (cadastroFormContainer) {
             const formCadastro = cadastroFormContainer.querySelector('form');
             if (formCadastro) {
                 formCadastro.addEventListener('submit', async function(e) {
                      e.preventDefault(); 
                      const url = `${API_URL}/auth/register`;
                      const dadosCadastro = {
                          nome: document.getElementById('cadastroNome').value, 
                          email: document.getElementById('cadastroEmail').value,
                          senha: document.getElementById('cadastroSenha').value,
                          cpf: document.getElementById('cadastroCpf').value.replace(/\D/g, ''), 
                          telefone: document.getElementById('cadastroTelefone').value.replace(/\D/g, ''),
                      };

                      try {
                          const response = await fetch(url, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(dadosCadastro)
                          });

                          const data = await response.json();
                          
                          if (response.ok) {
                              alert(`Usuário ${data.mensagem} (ID: ${data.id_usuario})`);
                              if (cadastroFormContainer) cadastroFormContainer.style.display = 'none';
                              if (loginFormContainer) loginFormContainer.style.display = 'none';
                              if (escolhaPerfilContainer) {
                                  escolhaPerfilContainer.style.display = 'block';
                                  escolhaPerfilContainer.classList.add('fade-in');
                              }
                              localStorage.setItem('temp_user_id', data.id_usuario); 
                          } else {
                              alert(`Erro ao cadastrar: ${data.erro || data.mensagem}`);
                              console.error("Erro do servidor:", data);
                          }
                      } catch (error) {
                          console.error('Erro de conexão:', error);
                          alert('Erro de conexão com o servidor. Verifique se o Flask está rodando em http://127.0.0.1:5000.');
                      }
                 });
             }
        }
    } 
    
    // --- Lógica de Escolha de Perfil (Mantida) ---
    window.escolherPerfil = function(tipo) {
         const userId = localStorage.getItem('temp_user_id');
         const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

         if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';

         if (!userId) {
             alert("Erro: ID de usuário não encontrado. Faça login ou cadastre-se novamente.");
             return; 
         }

         localStorage.setItem('user_id', userId);
         localStorage.removeItem('temp_user_id'); 

         if (tipo === 'profissional') {
             alert("Você escolheu Profissional. O próximo passo é preencher os dados de sua profissão.");
             window.location.href = './perfil.html'; 
             
         } else if (tipo === 'cliente') {
             alert("Você escolheu Cliente/Recrutador. Redirecionando para o painel principal.");
             window.location.href = './index.html'; 

         } else if (tipo === 'finalizar') {
             alert("Cadastro de perfil adiado. Redirecionando para o painel principal.");
             window.location.href = './index.html'; 
         }
    }
});