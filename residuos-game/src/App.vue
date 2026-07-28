<script setup>
import { onMounted, ref } from 'vue'
import GameViewport from './ecomundo/ui/GameViewport.vue'

const tips = [
  "Dica: Lave as embalagens antes de descartar no reciclável!",
  "Dica: Papel engordurado não pode ser reciclado, jogue no rejeito.",
  "Dica: Pilhas contêm metais pesados e devem ter descarte especial.",
  "Dica: O vidro é 100% reciclável e pode ser reutilizado infinitas vezes."
]

const randomTip = ref(tips[Math.floor(Math.random() * tips.length)])
const isLoading = ref(true)
const themeClass = ref('')
const gameScreen = ref({ type: 'NONE' })

function setGameScreen(screen) {
  gameScreen.value = screen || { type: 'NONE' }
}

function handleViewportAction(action) {
  const engine = window.GameEngine
  if (!engine) return

  switch (action) {
    case 'startGame':
      engine.startGame()
      break
    case 'continueGame':
      engine.continueGame()
      break
    case 'showRanking':
      engine.showRanking()
      break
    case 'about':
      engine.changeState(engine.STATES.ABOUT)
      break
    case 'confirmUsername':
      engine.confirmUsername()
      break
    case 'backToMenu':
      engine.changeState(engine.STATES.MENU)
      break
    case 'nextChapter':
      engine.nextChapter()
      break
    case 'retryChapter':
      engine.retryChapter()
      break
    case 'resetGame':
      engine.resetGame()
      break
    case 'share':
      engine.share()
      break
    default:
      break
  }
}

onMounted(() => {
  window.EcoViewController = {
    setScreen: setGameScreen,
    clearScreen: () => setGameScreen({ type: 'NONE' })
  }

  const initGame = () => {
    setTimeout(() => {
      isLoading.value = false
      if (window.GameEngine) {
        window.GameEngine.init()
      }
    }, 2000)
  }

  if (document.readyState === 'complete') {
    initGame()
  } else {
    window.addEventListener('load', initGame)
  }
})
</script>

<template>
  <main :class="themeClass">
    <!-- Tela de Loading Premium -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <h1 class="anim-pulse">EcoMundo</h1>
          <div class="loader"></div>
          <p class="tip-text">{{ randomTip }}</p>
        </div>
      </div>
    </Transition>

    <!-- Container do Jogo -->
    <div id="game-container"></div>
    <GameViewport :screen="gameScreen" @action="handleViewportAction" />
  </main>
</template>

<style>
/* Estilos Globais para garantir que ocupa todo o espaço */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

body {
  min-height: 100dvh;
}

main {
  width: 100%;
  min-height: 100dvh;
  position: relative;
}

#game-container {
  width: 100%;
  min-height: 100dvh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: inherit;
}

.screen-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  min-height: 100dvh;
  z-index: 30;
  pointer-events: auto;
}

/* Tela de Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  text-align: center;
  padding: 24px;
  box-sizing: border-box;
}

.loading-content {
  max-width: min(90vw, 560px);
}

.loading-content h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
  margin-bottom: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.loader {
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 5px solid #fff;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

.tip-text {
  font-size: clamp(1rem, 2.6vw, 1.2rem);
  font-style: italic;
  max-width: 500px;
  opacity: 0.9;
  padding: 0 20px;
}

/* Animações */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .loading-overlay {
    padding: 20px;
  }

  .tip-text {
    padding: 0;
  }
}
</style>
