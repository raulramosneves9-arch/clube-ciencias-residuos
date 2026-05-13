const GameHUD = {
    container: null,

    init() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        if (!document.getElementById('hud-container')) {
            this.container = document.createElement('div');
            this.container.id = 'hud-container';
            this.container.className = 'hud-overlay';
            this.container.innerHTML = `
                <div class="hud-top">
                    <div class="hud-stat">
                        <img src="assets/characters/mar.svg" alt="Mar" class="hud-icon anim-idle">
                        <div class="health-bar-container">
                            <div id="mar-health-bar" class="health-bar"></div>
                        </div>
                    </div>
                    <div class="hud-score">
                        <span id="hud-score-value">0</span> PTS
                        <div id="hud-combo-value" class="combo-text"></div>
                    </div>
                    <div class="hud-stat">
                        <img src="assets/characters/lixao.svg" alt="Lixão" class="hud-icon anim-pulse">
                        <div class="threat-bar-container">
                            <div id="lixao-threat-bar" class="threat-bar"></div>
                        </div>
                    </div>
                </div>
                <div class="hud-bottom">
                    <div id="hud-items-left">Itens: <span>0</span></div>
                    <div id="hud-timer" style="display: none;">Tempo: <span>00:00</span></div>
                    <div class="hud-audio-controls" style="display: flex; gap: 10px; margin-left: 20px;">
                        <button id="btn-toggle-sound" style="cursor:pointer; background:rgba(255,255,255,0.7); border:1px solid #ccc; border-radius:4px; padding:5px;" aria-label="Alternar Som">🔊</button>
                        <button id="btn-toggle-music" style="cursor:pointer; background:rgba(255,255,255,0.7); border:1px solid #ccc; border-radius:4px; padding:5px;" aria-label="Alternar Música">🎵</button>
                    </div>
                </div>
            `;
            gameContainer.appendChild(this.container);

            document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
                const isEnabled = window.GameAudio ? GameAudio.toggleSound() : false;
                e.target.textContent = isEnabled ? '🔊' : '🔇';
            });

            document.getElementById('btn-toggle-music').addEventListener('click', (e) => {
                const isEnabled = window.GameAudio ? GameAudio.toggleMusic() : false;
                e.target.textContent = isEnabled ? '🎵' : '🔇';
            });
        }
        this.hide();
    },

    show() {
        if (!this.container || !document.getElementById('hud-container')) {
            this.init();
        } else if (this.container && !document.body.contains(this.container)) {
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) gameContainer.appendChild(this.container);
        }

        if (this.container) this.container.style.display = 'flex';
    },

    hide() {
        if (this.container) this.container.style.display = 'none';
    },

    update(state) {
        if (!this.container) return;
        
        const healthBar = document.getElementById('mar-health-bar');
        if (healthBar && state.marHealth !== undefined) {
            healthBar.style.width = `${state.marHealth}%`;
            healthBar.style.backgroundColor = state.marHealth > 60 ? '#4CAF50' : state.marHealth > 30 ? '#FFC107' : '#F44336';
        }

        const threatBar = document.getElementById('lixao-threat-bar');
        if (threatBar && state.lixaoThreat !== undefined) {
            threatBar.style.width = `${state.lixaoThreat}%`;
        }

        const scoreEl = document.getElementById('hud-score-value');
        if (scoreEl && state.score !== undefined) {
            scoreEl.textContent = state.score;
        }

        const comboEl = document.getElementById('hud-combo-value');
        if (comboEl && state.combo !== undefined) {
            if (state.combo > 1) {
                comboEl.textContent = `x${state.combo} COMBO!`;
                comboEl.style.display = 'block';
            } else {
                comboEl.style.display = 'none';
            }
        }

        const itemsEl = document.querySelector('#hud-items-left span');
        if (itemsEl && state.itemsLeft !== undefined) {
            itemsEl.textContent = state.itemsLeft;
        }

        const timerEl = document.querySelector('#hud-timer span');
        const timerContainer = document.getElementById('hud-timer');
        if (timerEl && state.timeLeft !== undefined) {
            timerContainer.style.display = 'block';
            const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
            const seconds = (state.timeLeft % 60).toString().padStart(2, '0');
            timerEl.textContent = `${minutes}:${seconds}`;
        } else if (timerContainer) {
            timerContainer.style.display = 'none';
        }
    }
};

// Auto-init HUD when loaded
document.addEventListener("DOMContentLoaded", () => {
    GameHUD.init();
});
window.GameHUD = GameHUD;
