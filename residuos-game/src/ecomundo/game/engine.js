// Motor do Jogo - Máquina de Estados (T-003)

const GameEngine = {
    STATES: {
        MENU: 'MENU',
        NARRATIVE: 'NARRATIVE',
        PUZZLE: 'PUZZLE',
        RESULTS: 'RESULTS',
        GAMEOVER: 'GAMEOVER'
    },
    
    currentState: null,

    init() {
        console.log("GameEngine inicializada.");
        this.changeState(this.STATES.MENU);
        
        // requestAnimationFrame(this.loop.bind(this)); // Loop principal se necessário futuramente
    },

    changeState(newState) {
        if (!Object.values(this.STATES).includes(newState)) {
            console.error("Estado inválido:", newState);
            return;
        }

        console.log(`Transição de estado: ${this.currentState || 'NONE'} -> ${newState}`);
        this.currentState = newState;
        this.renderCurrentState();
    },

    renderCurrentState() {
        const container = document.getElementById('game-container');
        if (!container) return;

        // Efeito de transição de fade (T-405)
        container.classList.add('fade-out');
        
        setTimeout(() => {
            container.innerHTML = ''; // Limpa tela
            
            // Esconde HUD por padrão
            if (typeof GameHUD !== 'undefined') GameHUD.hide();

            switch (this.currentState) {
                case this.STATES.MENU:
                    this.renderMenu(container);
                    break;
                case this.STATES.NARRATIVE:
                    if (typeof GameNarrative !== 'undefined') {
                        GameNarrative.start(GameState.data.currentChapter);
                    } else {
                        container.innerHTML = `<div style="padding: 20px;">[NARRATIVE] Capítulo ${GameState.data.currentChapter}</div>`;
                    }
                    break;
                case this.STATES.PUZZLE:
                    if (typeof GamePuzzle !== 'undefined') {
                        GamePuzzle.start(GameState.data.currentChapter);
                    } else {
                        container.innerHTML = `<div style="padding: 20px;">[PUZZLE] Capítulo ${GameState.data.currentChapter}</div>`;
                    }
                    if (typeof GameHUD !== 'undefined') GameHUD.show();
                    break;
                case this.STATES.RESULTS:
                    this.renderResults(container);
                    break;
                case this.STATES.GAMEOVER:
                    this.renderGameOver(container);
                    break;
            }
            
            container.classList.remove('fade-out');
            container.classList.add('fade-in');
            setTimeout(() => container.classList.remove('fade-in'), 500);

        }, 300); // tempo do fade
    },

    renderMenu(container) {
        container.innerHTML = `
            <div class="screen-menu">
                <div class="menu-bg">
                    <!-- Cenário animado de fundo -->
                    <img src="assets/scenes/menu.svg" class="bg-img" alt="Background" onerror="this.style.display='none'">
                </div>
                <div class="menu-content anim-idle">
                    <h1 class="game-title">EcoMundo</h1>
                    <p class="motivational-quote">"Cada atitude conta para salvar o nosso Mar!"</p>
                    <div class="menu-buttons">
                        <button class="btn-primary" onclick="GameEngine.startGame()">Jogar</button>
                        ${GameState.data.currentChapter > 1 ? `<button class="btn-secondary" onclick="GameEngine.continueGame()">Continuar</button>` : ''}
                        <button class="btn-secondary" onclick="alert('EcoMundo - Jogo Educativo de Triagem de Resíduos')">Sobre</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderResults(container) {
        const fact = "Dica: Reciclar 1 tonelada de papel poupa 22 árvores e economiza 71% de energia elétrica!"; // Fato educativo
        container.innerHTML = `
            <div class="screen-results slide-in">
                <h2>Capítulo Concluído!</h2>
                <div class="results-stats">
                    <p>Pontuação: <span>${GameState.data.totalScore}</span></p>
                    <img src="assets/characters/mar.svg" class="mar-result anim-bounce" alt="Mar Feliz" onerror="this.style.display='none'">
                </div>
                <div class="educational-fact">
                    <p><strong>Você Sabia?</strong> ${fact}</p>
                </div>
                <div class="menu-buttons">
                    <button class="btn-primary" onclick="GameEngine.nextChapter()">Próximo Capítulo</button>
                </div>
            </div>
        `;
    },

    renderGameOver(container) {
        container.innerHTML = `
            <div class="screen-gameover slide-in">
                <h2>O Mundo Está Salvo!</h2>
                <p>O Mar está completamente saudável, a Recicla comemora e o Lixão foi derrotado!</p>
                <div class="impact-summary">
                    <p>Você destinou corretamente muitos resíduos!</p>
                    <h3>Pontuação Final: ${GameState.data.totalScore}</h3>
                </div>
                <div class="menu-buttons">
                    <button class="btn-primary" onclick="GameEngine.share()">Compartilhar Vitória</button>
                    <button class="btn-secondary" onclick="GameEngine.resetGame()">Jogar Novamente</button>
                    <a href="https://sinir.gov.br/" target="_blank" class="btn-link">Aprenda mais sobre Reciclagem no Brasil</a>
                </div>
            </div>
        `;
    },

    startGame() {
        GameState.reset();
        if (typeof GameAudio !== 'undefined') GameAudio.startMusic();
        this.changeState(this.STATES.NARRATIVE);
    },

    continueGame() {
        if (typeof GameAudio !== 'undefined') GameAudio.startMusic();
        this.changeState(this.STATES.NARRATIVE);
    },

    nextChapter() {
        GameState.update('currentChapter', GameState.data.currentChapter + 1);
        if (GameState.data.currentChapter > 5) {
            this.changeState(this.STATES.GAMEOVER);
        } else {
            // Transição de varredura verde (T-405)
            const sweep = document.createElement('div');
            sweep.className = 'green-sweep';
            document.body.appendChild(sweep);
            setTimeout(() => {
                this.changeState(this.STATES.NARRATIVE);
                setTimeout(() => sweep.remove(), 1000);
            }, 500);
        }
    },

    resetGame() {
        GameState.reset();
        this.changeState(this.STATES.MENU);
    },

    share() {
        const text = `Eu ajudei a salvar o Mar no EcoMundo com ${GameState.data.totalScore} pontos! Jogue também e aprenda sobre reciclagem!`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado para a área de transferência!');
        }).catch(err => {
            alert('Falha ao copiar texto.');
        });
    },

    loop(timestamp) {
        // Atualizações frame a frame
        // requestAnimationFrame(this.loop.bind(this));
    }
};

window.GameEngine = GameEngine;
