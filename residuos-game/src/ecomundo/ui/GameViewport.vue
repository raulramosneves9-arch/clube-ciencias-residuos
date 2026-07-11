<script setup>
const props = defineProps({
  screen: {
    type: Object,
    default: () => ({ type: 'NONE' })
  }
})

const emit = defineEmits(['action'])

function runAction(action) {
  emit('action', action)
}
</script>

<template>
  <div v-if="screen.type && screen.type !== 'NONE'" class="screen-overlay">
    <div v-if="screen.type === 'MENU'" class="screen-menu">
      <div class="menu-bg">
        <img src="/assets/scenes/menu.svg" class="bg-img" alt="Background" onerror="this.style.display='none'">
      </div>
      <div class="menu-content anim-idle">
        <h1 class="game-title">EcoMundo</h1>
        <p class="motivational-quote">"Cada atitude conta para salvar o nosso Mar!"</p>
        <div class="menu-buttons">
          <button class="btn-primary" @click="runAction('startGame')">Jogar</button>
          <button v-if="screen.data?.currentChapter > 1" class="btn-secondary" @click="runAction('continueGame')">Continuar</button>
          <button class="btn-secondary" @click="runAction('showRanking')">Ver Ranking</button>
          <button class="btn-secondary" @click="runAction('about')">Sobre</button>
        </div>
      </div>
    </div>

    <div v-else-if="screen.type === 'USERNAME'" class="screen-username slide-in">
      <div class="username-card">
        <h2>Bem-vindo ao EcoMundo!</h2>
        <p>Digite seu nome para começar a salvar o planeta:</p>
        <input type="text" id="username-input" class="username-input" placeholder="Digite seu nome..." maxlength="20" autocomplete="off">
        <div class="username-buttons">
          <button class="btn-primary" @click="runAction('confirmUsername')">Começar Jogo</button>
          <button class="btn-secondary" @click="runAction('backToMenu')">Voltar</button>
        </div>
      </div>
    </div>

    <div v-else-if="screen.type === 'RESULTS'" class="screen-results slide-in">
      <h2>{{ screen.data?.resultStateIcon }} {{ screen.data?.resultTitle }}</h2>
      <div class="results-stats">
        <p>Pontuação no capítulo: <span>{{ screen.data?.score || 0 }}</span></p>
        <p>Saúde do Mar: <span>{{ screen.data?.marHealth || 0 }}%</span></p>
        <p>Acertos: <span>{{ screen.data?.successRate || 0 }}%</span></p>
        <img src="/assets/characters/mar.svg" class="mar-result anim-bounce" alt="Mar Feliz" onerror="this.style.display='none'">
      </div>
      <div class="educational-fact">
        <p><strong>{{ screen.data?.feedback }}</strong></p>
        <p><strong>Você Sabia?</strong> Dica: Reciclar 1 tonelada de papel poupa 22 árvores e economiza 71% de energia elétrica!</p>
      </div>
      <div class="menu-buttons">
        <button v-if="screen.data?.passed" class="btn-primary" @click="runAction('nextChapter')">Próximo Capítulo</button>
        <button v-else class="btn-primary" @click="runAction('retryChapter')">Tentar Novamente</button>
        <button class="btn-secondary" @click="runAction('backToMenu')">Voltar ao Menu</button>
      </div>
    </div>

    <div v-else-if="screen.type === 'GAMEOVER'" class="screen-gameover slide-in">
      <h2>O Mundo Está Salvo!</h2>
      <p>O Mar está completamente saudável, a Recicla comemora e o Lixão foi derrotado!</p>
      <div class="impact-summary">
        <p>Você destinou corretamente muitos resíduos!</p>
        <h3>Pontuação Final: {{ screen.data?.score || 0 }}</h3>
        <p style="color: #2E7D32; font-size: 1.1rem; font-weight: bold;">{{ screen.data?.positionMessage || '✨ Obrigado por jogar! ✨' }}</p>
      </div>
      <div class="menu-buttons">
        <button class="btn-primary" @click="runAction('share')">Compartilhar Vitória</button>
        <button class="btn-secondary" @click="runAction('showRanking')">Ver Ranking</button>
        <button class="btn-secondary" @click="runAction('resetGame')">Jogar Novamente</button>
        <a href="https://sinir.gov.br/" target="_blank" class="btn-link">Aprenda mais sobre Reciclagem no Brasil</a>
      </div>
    </div>

    <div v-else-if="screen.type === 'ABOUT'" class="screen-about slide-in">
      <div class="about-card">
        <h2>📚 Sobre o Clube de Ciências</h2>

        <div class="about-section">
          <h3>🏫 Nome do Clube</h3>
          <p><em>EcoCientistas Visionários</em></p>
        </div>

        <div class="about-section">
          <h3>📖 Sobre Nós</h3>
          <p><em>Somos um grupo de estudantes apaixonados por ciência e sustentabilidade, dedicados a promover a conscientização ambiental através de atividades práticas e educativas.</em></p>
        </div>

        <div class="about-section">
          <h3>👥 Membros</h3>
          <p><em>Raul, Rafaela, Laura, Ana Carolina, Bianca e Fernanda</em></p>
        </div>

        <div class="about-section">
          <h3>🎯 Nossas Atividades</h3>
          <p><em>Oficinas de reciclagem e compostagem, mutirões de limpeza, workshops educativos, desenvolvimento de projetos de pesquisa sobre resíduos sólidos e criação de materiais didáticos e jogos educativos para escolas e comunidades.</em></p>
        </div>

        <div class="about-section">
          <h3>📞 Contato</h3>
          <p><em>Email: contato@ecocientistas.org</em></p>
          <p><em>Telefone: +55 (11) 91234-5678</em></p>
          <p><em>Instagram: https://instagram.com/ecocientistas_visionarios</em></p>
        </div>

        <div class="about-section">
          <h3>🌱 Sustentabilidade</h3>
          <p><em>O EcoMundo foi desenvolvido como um projeto do nosso clube para conscientizar sobre a importância da reciclagem, do reúso e do descarte correto de resíduos. Promovemos ações educativas que conectam teoria e prática com foco na preservação dos ecossistemas marinhos e urbanos.</em></p>
        </div>

        <div class="menu-buttons">
          <button class="btn-secondary" @click="runAction('backToMenu')">Voltar ao Menu</button>
        </div>
      </div>
    </div>

    <div v-else-if="screen.type === 'RANKING'" class="screen-ranking slide-in">
      <h2>🏆 Ranking de Pontuação 🏆</h2>
      <div class="ranking-content" v-html="screen.data?.rankingHtml"></div>
      <div class="menu-buttons">
        <button class="btn-secondary" @click="runAction('backToMenu')">Voltar ao Menu</button>
      </div>
    </div>
  </div>
</template>
