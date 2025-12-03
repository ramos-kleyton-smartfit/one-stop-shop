// Pré-carregar apenas imagens críticas (home e próxima)
const criticalImages = ['home.svg', 'story-aline.svg'];
const lazyImages = ['story-vitor.svg', 'ad-aera.svg', 'comprar.svg', '12.svg'];

// Carregar críticas imediatamente
criticalImages.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Carregar outras depois
setTimeout(() => {
  lazyImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}, 1000);

// Navegação entre telas
let currentScreen = 'home';
let quantity = 2;

// Histórico de navegação para voltar
let screenHistory = ['home'];

// Controle de swipe
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function showScreen(screenId, direction = 'forward') {
  console.log(`Mudando para tela: ${screenId}`);
  
  const allScreens = document.querySelectorAll('.screen');
  const currentScreenEl = document.querySelector('.screen.active');
  const nextScreen = document.getElementById(`screen-${screenId}`);
  
  if (!nextScreen) {
    console.error(`❌ Tela não encontrada: screen-${screenId}`);
    return;
  }
  
  // Adicionar classe de direção para animação
  if (currentScreenEl) {
    currentScreenEl.classList.add(direction === 'forward' ? 'slide-out-left' : 'slide-out-right');
  }
  
  nextScreen.classList.add(direction === 'forward' ? 'slide-in-right' : 'slide-in-left');
  nextScreen.classList.add('active');
  
  // Remover classes de animação após terminar
  setTimeout(() => {
    allScreens.forEach(s => {
      s.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
      if (s !== nextScreen) {
        s.classList.remove('active');
      }
    });
  }, 300);
  
  nextScreen.scrollTop = 0;
  currentScreen = screenId;
  
  // Adicionar ao histórico se for forward
  if (direction === 'forward' && screenHistory[screenHistory.length - 1] !== screenId) {
    screenHistory.push(screenId);
  }
  
  console.log(`✓ Tela ativa: ${screenId}`);
  
  // Se for a tela do vídeo AERA, carregar e reproduzir
  if (screenId === 'ad') {
    const video = nextScreen.querySelector('.video-aera');
    if (video && video.readyState === 0) {
      video.load();
    }
    if (video) {
      video.play().catch(err => console.log('Erro ao reproduzir vídeo:', err));
      console.log('🎬 Vídeo AERA iniciado');
    }
  }
  
  const img = nextScreen.querySelector('.screen-bg');
  if (img) {
    console.log(`Imagem src: ${img.src}`);
    console.log(`Imagem complete: ${img.complete}`);
  }
}

function goBack() {
  if (screenHistory.length > 1) {
    screenHistory.pop(); // Remove tela atual
    const previousScreen = screenHistory[screenHistory.length - 1];
    showScreen(previousScreen, 'backward');
  }
}

function updateQuantity() {
  // Quantidade agora é controlada apenas pelo SVG
  console.log(`Quantidade: ${quantity}`);
}

// Eventos com delegation
document.addEventListener('click', (e) => {
  const target = e.target;
  
  // Botão fechar
  if (target.classList.contains('btn-close')) {
    showScreen('home');
    return;
  }
  
  // Links/botões com data-screen
  const screenTarget = target.closest('[data-screen]');
  if (screenTarget) {
    e.preventDefault();
    const screen = screenTarget.dataset.screen;
    showScreen(screen);
    return;
  }
  
  // Controles de quantidade e ações
  const action = target.dataset.action;
  
  if (action === 'minus' && quantity > 1) {
    quantity--;
    updateQuantity();
  } else if (action === 'plus' && quantity < 10) {
    quantity++;
    updateQuantity();
  } else if (action === 'buy') {
    const total = (quantity * 39.90).toFixed(2);
    alert(`✅ Compra realizada!\n\n${quantity} crédito${quantity > 1 ? 's' : ''} de aula\nTotal: R$ ${total}`);
  } else if (action === 'reload') {
    console.log('🔄 Reload da última tela!');
    location.reload();
  }
});

// Touch events para swipe (Instagram-like)
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  
  // Só considera swipe se movimento horizontal for maior que vertical
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Swipe para direita (voltar)
    if (diffX > 50) {
      goBack();
    }
    // Swipe para esquerda (avançar) - mesma lógica de click-advance
    else if (diffX < -50) {
      const activeScreen = document.querySelector('.screen.active');
      const clickAdvance = activeScreen?.querySelector('.click-advance');
      if (clickAdvance) {
        const nextScreen = clickAdvance.dataset.screen;
        if (nextScreen) {
          // Se estiver na tela final indo para home, faz refresh
          if (currentScreen === 'final' && nextScreen === 'home') {
            location.reload();
          } else {
            showScreen(nextScreen, 'forward');
          }
        }
      }
    }
  }
}

// Clique nas laterais para navegar (Instagram-like)
document.addEventListener('click', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;
  
  // Ignorar se clicou em botão ou área interativa
  if (e.target.closest('a, button, [data-action], .hotspot-qty-minus, .hotspot-qty-plus, .hotspot-btn-comprar')) {
    return;
  }
  
  const clickX = e.clientX;
  const screenWidth = window.innerWidth;
  
  // Clique no terço esquerdo = voltar
  if (clickX < screenWidth / 3 && currentScreen !== 'home') {
    goBack();
  }
  // Clique no resto da tela = avançar (se tiver click-advance)
  else {
    const clickAdvance = activeScreen.querySelector('.click-advance, .clickable-story');
    if (clickAdvance && clickX >= screenWidth / 3) {
      const nextScreen = clickAdvance.dataset.screen;
      if (nextScreen) {
        console.log(`🔍 Current: ${currentScreen}, Next: ${nextScreen}`);
        // Se estiver na tela final indo para home, faz refresh
        if (currentScreen === 'final' && nextScreen === 'home') {
          console.log('🔄 Refresh da página!');
          location.reload();
        } else {
          showScreen(nextScreen, 'forward');
        }
      }
    }
  }
});

// Inicializar
updateQuantity();
console.log('✅ App carregado!');
console.log('📱 Clique no story da Aline para começar');
