// Pré-carregar todas as imagens
const imagesToPreload = [
  'home.svg',
  'story-aline.svg',
  'story-vitor.svg',
  'ad-aera.svg',
  'comprar.svg'
];

imagesToPreload.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Navegação entre telas
let currentScreen = 'home';
let quantity = 2;

function showScreen(screenId) {
  console.log(`Mudando para tela: ${screenId}`);
  
  // Esconder todas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  // Mostrar solicitada
  const screen = document.getElementById(`screen-${screenId}`);
  if (screen) {
    screen.classList.add('active');
    screen.scrollTop = 0;
    currentScreen = screenId;
    console.log(`✓ Tela ativa: ${screenId}`);
    
    // Verificar se a imagem carregou
    const img = screen.querySelector('.screen-bg');
    if (img) {
      console.log(`Imagem src: ${img.src}`);
      console.log(`Imagem complete: ${img.complete}`);
    }
  } else {
    console.error(`❌ Tela não encontrada: screen-${screenId}`);
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
  }
});

// Inicializar
updateQuantity();
console.log('✅ App carregado!');
console.log('📱 Clique no story da Aline para começar');
