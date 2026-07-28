// Motor do Jogo - Máquina de Estados (T-003)

const GameEngine = {
    STATES: {
        MENU: 'MENU',
        USERNAME: 'USERNAME',
        NARRATIVE: 'NARRATIVE',
        PUZZLE: 'PUZZLE',
        RESULTS: 'RESULTS',
        GAMEOVER: 'GAMEOVER',
        ABOUT: 'ABOUT'
    },

    initialized: false,
    currentState: null,
    lastPuzzleOutcome: null,
    pendingScreen: null,

    getNormalizedPuzzleOutcome(outcome = this.lastPuzzleOutcome) {
        if (!outcome || typeof outcome !== 'object') {
            return {
                passed: true,
                feedback: 'Capítulo concluído!',
                score: 0,
                marHealth: 0,
                successRate: 0
            };
        }

        return {
            passed: typeof outcome.passed === 'boolean' ? outcome.passed : true,
            feedback: typeof outcome.feedback === 'string' && outcome.feedback.trim() ? outcome.feedback : 'Capítulo concluído!',
            score: typeof outcome.score === 'number' ? outcome.score : 0,
            marHealth: typeof outcome.marHealth === 'number' ? outcome.marHealth : 0,
            successRate: typeof outcome.successRate === 'number' ? outcome.successRate : 0,
            chapter: typeof outcome.chapter === 'string' ? outcome.chapter : undefined
        };
    },

    init() {
        if (this.initialized) {
            console.warn("GameEngine já inicializado. Ignorando inicialização duplicada.");
            return;
        }

        this.initialized = true;
        console.log("GameEngine inicializada.");

        if (typeof GameHUD !== 'undefined') {
            GameHUD.init();
        }

        if (typeof GameNarrative !== 'undefined') {
            GameNarrative.init();
        }

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

        if (newState === this.STATES.RESULTS) {
            this.lastPuzzleOutcome = this.getNormalizedPuzzleOutcome(this.lastPuzzleOutcome);
        }

        console.log(`Transição de estado: ${this.currentState || 'NONE'} -> ${newState}`);
        this.currentState = newState;
        this.renderCurrentState();
    },

    renderCurrentState() {
        const container = document.getElementById('game-container');
        if (!container) return;

        container.classList.add('fade-out');

        setTimeout(() => {
            container.innerHTML = '';
            container.style.backgroundImage = '';
            container.style.backgroundColor = '';
            if (typeof GameHUD !== 'undefined') GameHUD.hide();

            switch (this.currentState) {
                case this.STATES.MENU:
                    this.renderMenu();
                    break;
                case this.STATES.USERNAME:
                    this.renderUsername();
                    break;
                case this.STATES.NARRATIVE:
                    this.clearViewportScreen();
                    if (typeof GameNarrative !== 'undefined') {
                        GameNarrative.start(GameState.data.currentChapter);
                    } else {
                        container.innerHTML = `<div style="padding: 20px;">[NARRATIVE] Capítulo ${GameState.data.currentChapter}</div>`;
                    }
                    break;
                case this.STATES.PUZZLE:
                    this.clearViewportScreen();
                    if (typeof GamePuzzle !== 'undefined') {
                        GamePuzzle.start(GameState.data.currentChapter);
                    } else {
                        container.innerHTML = `<div style="padding: 20px;">[PUZZLE] Capítulo ${GameState.data.currentChapter}</div>`;
                    }
                    if (typeof GameHUD !== 'undefined') GameHUD.show();
                    break;
                case this.STATES.RESULTS:
                    this.renderResults();
                    break;
                case this.STATES.GAMEOVER:
                    this.renderGameOver();
                    break;
                case this.STATES.ABOUT:
                    this.renderAbout();
                    break;
            }

            container.classList.remove('fade-out');
            container.classList.add('fade-in');
            setTimeout(() => container.classList.remove('fade-in'), 500);

        }, 300);
    },

    renderMenu() {
        this.renderViewportScreen({
            type: this.STATES.MENU,
            data: { currentChapter: GameState.data.currentChapter }
        });
    },

    renderUsername() {
        this.renderViewportScreen({ type: this.STATES.USERNAME });

        setTimeout(() => {
            const input = document.getElementById('username-input');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.confirmUsername();
                    }
                });
            }
        }, 100);
    },

    renderResults() {
        const outcome = this.getNormalizedPuzzleOutcome(this.lastPuzzleOutcome);
        this.renderViewportScreen({
            type: this.STATES.RESULTS,
            data: {
                passed: outcome.passed,
                score: outcome.score || 0,
                marHealth: outcome.marHealth || 0,
                successRate: Math.round((outcome.successRate || 0) * 100),
                feedback: outcome.feedback,
                resultTitle: outcome.passed ? 'Capítulo Concluído!' : 'Capítulo Incompleto',
                resultStateIcon: outcome.passed ? '✅' : '⚠️'
            }
        });
    },

    renderGameOver() {
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

        this.renderViewportScreen({
            type: this.STATES.GAMEOVER,
            data: {
                score,
                positionMessage: positionMessage || '✨ Obrigado por jogar! ✨'
            }
        });
    },

    hasExistingProgress() {
        try {
            const saved = localStorage.getItem('ecomundo_save');
            if (!saved) return false;

            const parsed = JSON.parse(saved);
            if (!parsed || typeof parsed !== 'object') return false;

            const currentChapter = typeof parsed.currentChapter === 'number' ? parsed.currentChapter : 1;
            const totalScore = typeof parsed.totalScore === 'number' ? parsed.totalScore : 0;
            const username = typeof parsed.currentUsername === 'string' ? parsed.currentUsername.trim() : '';

            return currentChapter > 1 || totalScore > 0 || !!username;
        } catch (e) {
            console.error('Erro ao verificar progresso salvo:', e);
            return false;
        }
    },

    startGame() {
        if (this.hasExistingProgress()) {
            const confirmReset = confirm('Existe um progresso salvo. Deseja começar um novo jogo e apagar o progresso atual? Clique OK para reiniciar, Cancelar para continuar o jogo salvo.');
            if (!confirmReset) {
                if (typeof GameAudio !== 'undefined') GameAudio.startMusic();
                this.changeState(this.STATES.NARRATIVE);
                return;
            }
        }

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
            const sweep = document.createElement('div');
            sweep.className = 'green-sweep';
            document.body.appendChild(sweep);
            setTimeout(() => {
                this.changeState(this.STATES.NARRATIVE);
                setTimeout(() => sweep.remove(), 1000);
            }, 500);
        }
    },

    retryChapter() {
        this.changeState(this.STATES.NARRATIVE);
    },

    resetGame() {
        if (this.hasExistingProgress()) {
            const confirmReset = confirm('Isso apagará o progresso salvo atual. Deseja continuar?');
            if (!confirmReset) return;
        }

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
        const leaderboardHTML = typeof GameLeaderboard !== 'undefined'
            ? GameLeaderboard.getHTML()
            : '<p style="text-align: center; color: #999;">Leaderboard não carregado.</p>';

        this.renderViewportScreen({
            type: 'RANKING',
            data: { rankingHtml: leaderboardHTML }
        });
    },

    renderAbout() {
        this.renderViewportScreen({ type: this.STATES.ABOUT });
    },

    clearViewportScreen() {
        this.renderViewportScreen({ type: 'NONE' });
    },

    renderViewportScreen(screen) {
        if (window.EcoViewController && typeof window.EcoViewController.setScreen === 'function') {
            window.EcoViewController.setScreen(screen);
            this.pendingScreen = null;
        } else {
            this.pendingScreen = screen;
        }
    },

    loop(timestamp) {
        // Atualizações frame a frame
        // requestAnimationFrame(this.loop.bind(this));
    }
};

window.GameEngine = GameEngine;
