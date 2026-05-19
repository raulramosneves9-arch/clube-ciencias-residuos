// Motor do Jogo - Máquina de Estados (T-003)

const GameEngine = {
    STATES: {
        MENU: 'MENU',
        USERNAME: 'USERNAME',
        NARRATIVE: 'NARRATIVE',
        PUZZLE: 'PUZZLE',
        RESULTS: 'RESULTS',
        GAMEOVER: 'GAMEOVER'
    },

    currentState: null,

    init() {
        console.log("GameEngine inicializada.");

        // Carrega o leaderboard do localStorage
        if (typeof GameLeaderboard !== 'undefined') {
            GameLeaderboard.load();
        }

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
                case this.STATES.USERNAME:
                    this.renderUsername(container);
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
                        <button class="btn-secondary" onclick="GameEngine.showRanking()">Ver Ranking</button>
                        <button class="btn-secondary" onclick="alert('EcoMundo - Jogo Educativo de Triagem de Resíduos')">Sobre</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderUsername(container) {
        container.innerHTML = `
            <div class="screen-username slide-in">
                <div class="username-card">
                    <h2>Bem-vindo ao EcoMundo!</h2>
                    <p>Digite seu nome para começar a salvar o planeta:</p>
                    <input type="text" id="username-input" class="username-input" placeholder="Digite seu nome..." maxlength="20" autocomplete="off">
                    <div class="username-buttons">
                        <button class="btn-primary" onclick="GameEngine.confirmUsername()">Começar Jogo</button>
                        <button class="btn-secondary" onclick="GameEngine.changeState(GameEngine.STATES.MENU)">Voltar</button>
                    </div>
                </div>
            </div>
        `;

        // Focus no input e permite Enter para confirmar
        setTimeout(() => {
            const input = document.getElementById('username-input');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        GameEngine.confirmUsername();
                    }
                });
            }
        }, 100);
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
        // Registra o score no ranking
        const username = GameState.getUsername();
        const score = GameState.data.totalScore;
        let position = null;

        if (typeof GameLeaderboard !== 'undefined') {
            position = GameLeaderboard.getPosition(score);
            GameLeaderboard.addScore(username, score);
        }

        let positionMessage = '';
        if (position && position <= 3) {
            positionMessage = `🏆 Você ficou em ${position}º lugar no ranking!`;
        } else if (position && position <= 10) {
            positionMessage = `🎉 Você entrou no top 10! Posição: ${position}º lugar`;
        }

        container.innerHTML = `
            <div class="screen-gameover slide-in">
                <h2>O Mundo Está Salvo!</h2>
                <p>O Mar está completamente saudável, a Recicla comemora e o Lixão foi derrotado!</p>
                <div class="impact-summary">
                    <p>Você destinou corretamente muitos resíduos!</p>
                    <h3>Pontuação Final: ${score}</h3>
                    <p style="color: #2E7D32; font-size: 1.1rem; font-weight: bold;">${positionMessage || '✨ Obrigado por jogar! ✨'}</p>
                </div>
                <div class="menu-buttons">
                    <button class="btn-primary" onclick="GameEngine.share()">Compartilhar Vitória</button>
                    <button class="btn-secondary" onclick="GameEngine.showRanking()">Ver Ranking</button>
                    <button class="btn-secondary" onclick="GameEngine.resetGame()">Jogar Novamente</button>
                    <a href="https://sinir.gov.br/" target="_blank" class="btn-link">Aprenda mais sobre Reciclagem no Brasil</a>
                </div>
            </div>
        `;
    },

    startGame() {
        GameState.reset();
        if (typeof GameAudio !== 'undefined') GameAudio.startMusic();
        this.changeState(this.STATES.USERNAME);
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
        const username = GameState.getUsername();
        const score = GameState.data.totalScore;
        const text = `Sou ${username} e ajudei a salvar o Mar no EcoMundo com ${score} pontos! 🌍♻️ Jogue também e aprenda sobre reciclagem!`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado para a área de transferência!');
        }).catch(err => {
            alert('Falha ao copiar texto.');
        });
    },

    confirmUsername() {
        const input = document.getElementById('username-input');
        const username = input ? input.value.trim() : '';

        if (username === '') {
            alert('Por favor, digite seu nome para continuar!');
            return;
        }

        GameState.setUsername(username);
        this.changeState(this.STATES.NARRATIVE);
    },

    showRanking() {
        const container = document.getElementById('game-container');
        if (!container) return;

        container.classList.add('fade-out');

        setTimeout(() => {
            const leaderboardHTML = typeof GameLeaderboard !== 'undefined'
                ? GameLeaderboard.getHTML()
                : '<p style="text-align: center; color: #999;">Leaderboard não carregado.</p>';

            container.innerHTML = `
                <div class="screen-ranking slide-in">
                    <h2>🏆 Ranking de Pontuação 🏆</h2>
                    <div class="ranking-content">
                        ${leaderboardHTML}
                    </div>
                    <div class="menu-buttons">
                        <button class="btn-secondary" onclick="GameEngine.changeState(GameEngine.STATES.MENU)">Voltar ao Menu</button>
                    </div>
                </div>
            `;

            container.classList.remove('fade-out');
            container.classList.add('fade-in');
            setTimeout(() => container.classList.remove('fade-in'), 500);
        }, 300);
    },

    loop(timestamp) {
        // Atualizações frame a frame
        // requestAnimationFrame(this.loop.bind(this));
    }
};

window.GameEngine = GameEngine;
