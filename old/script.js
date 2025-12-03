// Gerenciamento de navegação entre telas
const screens = {
  home: document.getElementById('screen-home'),
  storyAline: document.getElementById('screen-story-aline'),
  ad: document.getElementById('screen-ad'),
  storyVitor: document.getElementById('screen-story-vitor'),
  buy: document.getElementById('screen-buy')
};

let currentScreen = 'home';

function showScreen(screenName) {
  // Esconder todas as telas
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.remove('active');
  });
  
  // Mostrar tela solicitada
  if (screens[screenName]) {
    screens[screenName].classList.add('active');
    currentScreen = screenName;
    
    // Reset scroll
    const app = document.getElementById('app');
    if (app) app.scrollTop = 0;
  }
}

// ==================== FLUXO DE NAVEGAÇÃO ====================

// 1. Clicar no story da Aline
const storyAline = document.getElementById('story-aline');
if (storyAline) {
  storyAline.addEventListener('click', (e) => {
    e.stopPropagation();
    showScreen('storyAline');
  });
}

// 2. Clicar na tela do story da Aline para avançar
const storyAlineScreen = document.getElementById('screen-story-aline');
if (storyAlineScreen) {
  storyAlineScreen.addEventListener('click', (e) => {
    // Não avançar se clicar em botões
    if (e.target.closest('button')) return;
    if (currentScreen === 'storyAline') {
      showScreen('ad');
    }
  });
}

// 3. Clicar na tela do Ad para avançar para Vitor
const adScreen = document.getElementById('screen-ad');
if (adScreen) {
  adScreen.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (currentScreen === 'ad') {
      showScreen('storyVitor');
    }
  });
}

// 4. Botão "Comprar Aula" no story do Vitor
const btnComprar = document.getElementById('btn-comprar');
if (btnComprar) {
  btnComprar.addEventListener('click', (e) => {
    e.stopPropagation();
    showScreen('buy');
  });
}

// Botões de fechar stories
const closeBtns = document.querySelectorAll('.btn-close-story');
closeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    showScreen('home');
  });
});

// ==================== INTERATIVIDADE TELA DE COMPRA ====================

let quantity = 2;
const qtyDisplay = document.getElementById('qty');
const btnMinus = document.querySelector('.btn-minus');
const btnPlus = document.querySelector('.btn-plus');

if (btnMinus) {
  btnMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      if (qtyDisplay) qtyDisplay.textContent = quantity;
    }
  });
}

if (btnPlus) {
  btnPlus.addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      if (qtyDisplay) qtyDisplay.textContent = quantity;
    }
  });
}

// Botão comprar principal
const btnComprarMain = document.querySelector('.btn-comprar-main');
if (btnComprarMain) {
  btnComprarMain.addEventListener('click', () => {
    const originalText = btnComprarMain.textContent;
    btnComprarMain.textContent = '✓ Comprado!';
    btnComprarMain.style.background = '#4CAF50';
    
    setTimeout(() => {
      btnComprarMain.textContent = originalText;
      btnComprarMain.style.background = '#FFC107';
    }, 2000);
  });
}

// ==================== ANIMAÇÕES ====================

// Animar barras de progresso quando story fica visível
function animateProgress(screen) {
  const bars = screen.querySelectorAll('.progress-bar.filled');
  bars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.transition = 'width 0.3s ease';
      bar.style.width = '100%';
    }, index * 100);
  });
}

// Observer para detectar mudanças de tela
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains('active') && 
        mutation.target.classList.contains('story-screen')) {
      animateProgress(mutation.target);
    }
  });
});

// Observar todas as telas de story
document.querySelectorAll('.story-screen').forEach(screen => {
  observer.observe(screen, {
    attributes: true,
    attributeFilter: ['class']
  });
});

// Log inicial
console.log('✓ App carregado');
console.log('→ Clique no avatar da Aline para iniciar o fluxo');
