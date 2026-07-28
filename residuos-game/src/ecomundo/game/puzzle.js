// Motor de Triagem (Puzzle) - Implementação da Fase 3

const GamePuzzle = {
    activeItems: [],
    config: null,
    chapter: null,
    chapterScene: null,
    chapterTitle: '',
    chapterDescription: '',
    combo: 0,
    score: 0,
    marHealth: 100, // 0 a 100
    lixaoThreat: 100, // 100 a 0 (vida do vilão)
    isPlaying: false,
    bossTimer: null,
    itemsToSpawn: 0,
    requiredScore: 0,
    requiredMarHealth: 0,
    requiredSuccessRate: 0,
    successfulDrops: 0,
    totalDrops: 0,
    slowEffectUntil: 0,
    powerupTypes: ['powerup_combo', 'powerup_shield', 'powerup_slow'],

    // Configurações por capítulo (T-303)
    difficulty: {
        cap1: { types: ['papel', 'plastico'], speed: 'slow', maxItems: 8, bins: ['papel', 'plastico'] },
        cap2: { types: ['papel', 'plastico', 'metal', 'vidro'], speed: 'medium', maxItems: 12, bins: ['papel', 'plastico', 'metal', 'vidro'] },
        cap3: { types: ['papel', 'plastico', 'metal', 'vidro', 'organico'], speed: 'fast', maxItems: 12, bins: ['papel', 'plastico', 'metal', 'vidro', 'organico'] },
        cap4: { types: ['papel', 'plastico', 'metal', 'vidro', 'organico', 'rejeito'], speed: 'fast', maxItems: 15, bins: ['papel', 'plastico', 'metal', 'vidro', 'organico', 'rejeito'] },
        cap5: { types: ['papel', 'plastico', 'metal', 'vidro', 'organico', 'rejeito', 'eletronico'], speed: 'very-fast', maxItems: 20, isBoss: true, bins: ['papel', 'plastico', 'metal', 'vidro', 'organico', 'rejeito', 'eletronico'] }
    },

    binColors: {
        papel: '#1976D2', // Azul
        plastico: '#D32F2F', // Vermelho
        metal: '#FBC02D', // Amarelo
        vidro: '#388E3C', // Verde
        organico: '#795548', // Marrom
        rejeito: '#616161', // Cinza
        eletronico: '#7B1FA2' // Roxo
    },

    itemIcons: {
        papel: 'assets/items/papel.svg',
        plastico: 'assets/items/plastico.svg',
        metal: 'assets/items/metal.svg',
        vidro: 'assets/items/vidro.svg',
        organico: 'assets/items/organico.svg',
        rejeito: 'assets/items/rejeito.svg',
        eletronico: 'assets/items/eletronico.svg'
    },

    start(chapterNumber) {
        this.chapter = 'cap' + chapterNumber;
        if (typeof DialogUI !== 'undefined') {
            DialogUI.hide();
        }

        const chapterData = window.ChaptersData && window.ChaptersData[this.chapter] ? window.ChaptersData[this.chapter] : null;
        const externalData = chapterData && chapterData.puzzles ? chapterData.puzzles : null;

        if (externalData) {
            const fallbackConfig = this.difficulty[this.chapter] || this.difficulty['cap1'];
            this.config = {
                types: externalData.itemTypes || fallbackConfig.types,
                speed: externalData.speed || fallbackConfig.speed,
                maxItems: typeof externalData.itemCount === 'number' ? externalData.itemCount : fallbackConfig.maxItems,
                spawnBatch: externalData.spawnBatch || fallbackConfig.spawnBatch || 1,
                isBoss: Boolean(externalData.bossMechanic),
                bins: externalData.itemTypes || fallbackConfig.bins
            };
            this.requiredScore = typeof externalData.requiredScore === 'number' ? externalData.requiredScore : 0;
            this.requiredMarHealth = typeof externalData.requiredMarHealth === 'number' ? externalData.requiredMarHealth : 0;
            this.requiredSuccessRate = typeof externalData.requiredSuccessRate === 'number' ? externalData.requiredSuccessRate : 0;
        } else {
            this.config = { ...this.difficulty[this.chapter] } || { ...this.difficulty['cap1'] };
            this.config.spawnBatch = this.config.spawnBatch || 1;
            this.requiredScore = 0;
            this.requiredMarHealth = 0;
            this.requiredSuccessRate = 0;
        }

        this.chapterScene = chapterData ? chapterData.scene : 'cidade';
        this.chapterTitle = chapterData ? chapterData.title : `Capítulo ${chapterNumber}`;
        this.chapterDescription = chapterData ? chapterData.description || '' : '';

        this.itemsToSpawn = this.config.maxItems;
        this.combo = 0;
        this.score = 0;
        this.marHealth = 100;
        this.lixaoThreat = 100;
        this.isPlaying = true;
        this.activeItems = [];
        this.successfulDrops = 0;
        this.totalDrops = 0;
        this.slowEffectUntil = 0;

        this.renderPuzzleUI();
        this.spawnNextItem();

        if (this.config.isBoss) {
            this.startBossMechanic();
        }
    },

    renderPuzzleUI() {
        const container = document.getElementById('game-container');
        const backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05)), url('assets/scenes/${this.chapterScene}.svg')`;

        container.innerHTML = `
            <div id="puzzle-area" style="position: relative; width: 100%; height: 100%; background: ${backgroundImage}; background-size: cover; background-position: center; overflow: hidden;">
                <div class="puzzle-chapter-banner">
                    <h2>${this.chapterTitle}</h2>
                    <p>${this.chapterDescription}</p>
                </div>
                <div id="spawn-area" style="position: absolute; top: 180px; left: 0; right: 0; bottom: 220px; pointer-events: none; z-index: 1;"></div>
                <div id="bins-area" style="position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; gap: 15px; padding: 0 20px; flex-wrap: wrap; z-index: 2;">
                </div>
            </div>
        `;

        const binsArea = document.getElementById('bins-area');
        this.config.bins.forEach(binType => {
            const binEl = document.createElement('div');
            binEl.className = 'bin';
            binEl.dataset.type = binType;
            binEl.style.width = '70px';
            binEl.style.height = '100px';
            binEl.style.backgroundColor = this.binColors[binType];
            binEl.style.border = '3px solid #222';
            binEl.style.borderRadius = '8px 8px 3px 3px';
            binEl.style.position = 'relative';
            binEl.style.display = 'flex';
            binEl.style.alignItems = 'flex-end';
            binEl.style.justifyContent = 'center';
            binEl.style.paddingBottom = '15px';
            binEl.style.color = binType === 'metal' ? '#000' : '#fff';
            binEl.style.fontWeight = 'bold';
            binEl.style.textTransform = 'uppercase';
            binEl.style.fontSize = '12px';
            binEl.style.textShadow = binType === 'metal' ? 'none' : '1px 1px 2px #000';
            binEl.style.transition = 'transform 0.1s';
            binEl.innerHTML = `<span>${binType}</span>`;

            // Acessibilidade: Teclado e ARIA
            binEl.tabIndex = 0;
            binEl.setAttribute('role', 'button');
            binEl.setAttribute('aria-label', 'Lixeira para ' + binType);

            binEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (window.selectedItemForKeyboard) {
                        GamePuzzle.handleDrop(window.selectedItemForKeyboard, binEl);
                        window.selectedItemForKeyboard = null;
                        document.querySelectorAll('.puzzle-item').forEach(item => {
                            if (item.parentNode) item.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                        });
                    }
                }
            });

            binsArea.appendChild(binEl);
        });
    },

    spawnItem(isBossThrow = false, forcePowerup = false) {
        if (!this.isPlaying) return;

        const isPowerup = forcePowerup || (this.chapter !== 'cap1' && Math.random() < 0.10);
        const type = isPowerup
            ? this.powerupTypes[Math.floor(Math.random() * this.powerupTypes.length)]
            : this.config.types[Math.floor(Math.random() * this.config.types.length)];

        const itemEl = document.createElement('div');
        itemEl.className = 'puzzle-item anim-idle';
        itemEl.dataset.type = type;

        itemEl.style.width = isPowerup ? '70px' : '60px';
        itemEl.style.height = isPowerup ? '70px' : '60px';
        itemEl.style.backgroundColor = isPowerup ? '#FFD54F' : this.binColors[type];
        itemEl.style.backgroundImage = isPowerup ? 'none' : `url('${this.itemIcons[type]}')`;
        itemEl.style.backgroundSize = 'contain';
        itemEl.style.backgroundRepeat = 'no-repeat';
        itemEl.style.backgroundPosition = 'center';
        itemEl.style.position = 'absolute';
        itemEl.style.cursor = 'grab';
        itemEl.style.pointerEvents = 'auto';
        itemEl.style.borderRadius = '50%';
        itemEl.style.border = '2px solid #fff';
        itemEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        itemEl.style.touchAction = 'none'; // Mobile touch fix

        if (isPowerup) {
            itemEl.style.color = '#212121';
            itemEl.style.fontWeight = '900';
            itemEl.style.fontSize = '24px';
            itemEl.style.display = 'flex';
            itemEl.style.alignItems = 'center';
            itemEl.style.justifyContent = 'center';
            itemEl.textContent = type === 'powerup_combo' ? '⚡' : type === 'powerup_shield' ? '🛡️' : '🐢';
            itemEl.setAttribute('aria-label', 'Item especial de suporte');
        } else {
            itemEl.setAttribute('aria-label', 'Resíduo tipo ' + type);
        }

        itemEl.tabIndex = 0;
        itemEl.setAttribute('role', 'button');

        itemEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.selectedItemForKeyboard = itemEl;
                document.querySelectorAll('.puzzle-item').forEach(item => {
                    item.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                });
                itemEl.style.boxShadow = '0 0 15px 5px #FFEB3B'; // highlight
            }
        });

        const spawnArea = document.getElementById('spawn-area');
        const maxLeft = spawnArea.clientWidth - 70;
        const maxTop = spawnArea.clientHeight - 70;

        let startLeft = Math.random() * maxLeft;
        let startTop = Math.random() * (maxTop / 2); // spawna na metade superior

        if (isBossThrow) {
            startLeft = maxLeft / 2; // Boss joga do centro
            itemEl.classList.add('anim-bounce');
        }

        itemEl.style.left = startLeft + 'px';
        itemEl.style.top = startTop + 'px';
        itemEl.style.zIndex = 5;

        spawnArea.appendChild(itemEl);

        this.setupDrag(itemEl);

        if (!isBossThrow && !isPowerup) {
            this.itemsToSpawn--;
            this.updateHUD();
        }

        if (['cap3', 'cap4', 'cap5'].includes(this.chapter)) {
            this.animateItem(itemEl);
        }
    },

    animateItem(itemEl) {
        // Movimento simples descendente ou flutuante
        let top = parseFloat(itemEl.style.top);
        const interval = setInterval(() => {
            if (!itemEl.parentNode || !this.isPlaying) {
                clearInterval(interval);
                return;
            }
            if (itemEl.style.cursor === 'grabbing') return; // não move se estiver arrastando

            top += (this.chapter === 'cap5' ? 2 : 1);
            itemEl.style.top = top + 'px';

            const spawnArea = document.getElementById('spawn-area');
            if (top > spawnArea.clientHeight) {
                // Item caiu fora da tela sem ser coletado (Penalidade)
                clearInterval(interval);
                if (itemEl.parentNode) {
                    this.handleError(itemEl, null, true);
                    itemEl.remove();
                    this.checkEndCondition();
                }
            }
        }, 50);
        itemEl.dataset.intervalId = interval;
    },

    setupDrag(itemEl) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const onPointerDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseFloat(itemEl.style.left);
            initialTop = parseFloat(itemEl.style.top);
            itemEl.style.cursor = 'grabbing';
            itemEl.style.zIndex = 1000;
            itemEl.style.transition = 'none';
            itemEl.classList.remove('anim-idle');
            e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            itemEl.style.left = initialLeft + dx + 'px';
            itemEl.style.top = initialTop + dy + 'px';

            // Highlight lixeira abaixo do cursor (T-302)
            document.querySelectorAll('.bin').forEach(bin => {
                bin.style.transform = 'scale(1)';
                bin.style.boxShadow = 'none';
            });
            const dropTarget = this.getBinUnderCursor(e.clientX, e.clientY);
            if (dropTarget) {
                dropTarget.style.transform = 'scale(1.15)'; // Highlight
                dropTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.8)';
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            itemEl.style.cursor = 'grab';
            itemEl.style.zIndex = '';

            document.querySelectorAll('.bin').forEach(bin => {
                bin.style.transform = 'scale(1)';
                bin.style.boxShadow = 'none';
            });

            const dropTarget = this.getBinUnderCursor(e.clientX, e.clientY);

            if (dropTarget) {
                this.handleDrop(itemEl, dropTarget);
            } else {
                // Retorna ao ponto inicial
                itemEl.style.transition = 'all 0.3s ease';
                itemEl.style.left = initialLeft + 'px';
                itemEl.style.top = initialTop + 'px';
                itemEl.classList.add('anim-idle');
            }
        };

        itemEl.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);

        itemEl.cleanupDrag = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            if (itemEl.dataset.intervalId) clearInterval(parseInt(itemEl.dataset.intervalId));
        };
    },

    getBinUnderCursor(x, y) {
        const elements = document.elementsFromPoint(x, y);
        return elements.find(el => el.classList.contains('bin'));
    },

    handleDrop(itemEl, binEl) {
        const itemType = itemEl.dataset.type;
        const binType = binEl.dataset.type;

        // T-301: Validação
        if (itemType.startsWith('powerup_')) {
            this.handlePowerup(itemEl, itemType, binEl);
        } else if (itemType === binType) {
            this.handleSuccess(itemEl, binEl);
        } else {
            this.handleError(itemEl, binEl);
        }

        itemEl.cleanupDrag();
        itemEl.remove();

        this.checkEndCondition();
    },

    handlePowerup(itemEl, powerupType, binEl) {
        this.totalDrops += 1;
        this.successfulDrops += 1;
        let bonus = 0;

        if (powerupType === 'powerup_combo') {
            bonus = 25;
            this.combo = Math.max(this.combo, 3);
            this.showFloatingText('COMBO BOOST!', itemEl.getBoundingClientRect(), '#FF9800');
        } else if (powerupType === 'powerup_shield') {
            bonus = 20;
            this.marHealth = Math.min(100, this.marHealth + 12);
            this.showFloatingText('Escudo! +12%', itemEl.getBoundingClientRect(), '#4CAF50');
        } else if (powerupType === 'powerup_slow') {
            bonus = 15;
            this.slowEffectUntil = Date.now() + 6000;
            this.showFloatingText('Tempo Estendido!', itemEl.getBoundingClientRect(), '#03A9F4');
        }

        this.score += bonus;
        this.updateHUD();
        if (window.GameAudio) GameAudio.playSuccess();
        this.showFloatingText(`+${bonus}`, itemEl.getBoundingClientRect(), '#FFFFFF');
    },

    checkEndCondition() {
        if (this.itemsToSpawn > 0) {
            this.spawnNextItem();
        } else if (document.querySelectorAll('.puzzle-item').length === 0) {
            this.endPuzzle();
        }
    },

    handleSuccess(itemEl, binEl) {
        // T-304: Sistema de combo
        this.combo++;
        this.totalDrops += 1;
        this.successfulDrops += 1;
        let multiplier = 1;
        if (this.combo >= 5) multiplier = 3;
        else if (this.combo >= 3) multiplier = 2;

        const points = 10 * multiplier;
        this.score += points;
        this.marHealth = Math.min(100, this.marHealth + 2); // Mar melhora levemente
        this.lixaoThreat = Math.max(0, this.lixaoThreat - 5); // Lixão perde "vida"

        binEl.classList.add('anim-pulse');
        setTimeout(() => binEl.classList.remove('anim-pulse'), 500);

        this.updateHUD();
        this.showFloatingText(`+${points}`, binEl.getBoundingClientRect(), '#4CAF50');

        if (window.GameAudio) {
            if (this.combo >= 3) {
                GameAudio.playCombo(multiplier);
            } else {
                GameAudio.playSuccess();
            }
        }

        if (this.combo === 5) {
            this.showFloatingText('COMBO MAX!', document.getElementById('hud-score-value').getBoundingClientRect(), '#FFC107');
        }
    },

    handleError(itemEl, binEl, droppedOffscreen = false) {
        this.totalDrops += 1;
        // T-304: Erro quebra o combo
        this.combo = 0;
        this.marHealth = Math.max(0, this.marHealth - 5); // Penalidade leve

        if (window.GameAudio) {
            GameAudio.playError();
        }

        if (binEl) {
            binEl.classList.add('anim-shake'); // T-302: Lixeira "shake" no erro
            setTimeout(() => binEl.classList.remove('anim-shake'), 500);
            this.showFloatingText('ERRO!', binEl.getBoundingClientRect(), '#F44336');
        } else if (droppedOffscreen) {
            this.showFloatingText('PERDIDO!', itemEl.getBoundingClientRect(), '#F44336');
        }

        this.updateHUD();
    },

    updateHUD() {
        if (typeof GameHUD !== 'undefined') {
            GameHUD.update({
                marHealth: this.marHealth,
                lixaoThreat: this.lixaoThreat,
                score: this.score,
                combo: this.combo,
                itemsLeft: this.itemsToSpawn
            });
        }
    },

    determinePass() {
        if (this.config.isBoss) {
            return this.lixaoThreat === 0;
        }

        const successRate = this.totalDrops === 0 ? 1 : (this.successfulDrops / this.totalDrops);
        if (this.requiredScore && this.score < this.requiredScore) return false;
        if (this.requiredMarHealth && this.marHealth < this.requiredMarHealth) return false;
        if (this.requiredSuccessRate && successRate < this.requiredSuccessRate) return false;
        return true;
    },

    getPassFeedback() {
        if (this.config.isBoss) {
            return this.lixaoThreat === 0
                ? 'Você derrotou o Lixão e salvou o EcoMundo!'
                : 'O Lixão ainda está forte. Tente novamente para vencê-lo!';
        }

        const successRate = this.totalDrops === 0 ? 1 : (this.successfulDrops / this.totalDrops);
        if (this.score < this.requiredScore) return `Você precisa de pelo menos ${this.requiredScore} pontos.`;
        if (this.marHealth < this.requiredMarHealth) return `O Mar precisa estar com ao menos ${this.requiredMarHealth}% de saúde.`;
        if (this.requiredSuccessRate && successRate < this.requiredSuccessRate) return `Acertos insuficientes: ${(successRate * 100).toFixed(0)}%.`;
        return 'Parabéns! Você completou o capítulo com sucesso.';
    },

    showFloatingText(text, rect, color) {
        const el = document.createElement('div');
        el.textContent = text;
        el.style.position = 'absolute';
        el.style.left = rect.left + (rect.width / 2) + 'px';
        el.style.top = rect.top + 'px';
        el.style.color = color;
        el.style.fontWeight = 'bold';
        el.style.fontSize = '24px';
        el.style.textShadow = '1px 1px 2px #000';
        el.style.pointerEvents = 'none';
        el.style.zIndex = 2000;
        el.style.transition = 'all 1s ease-out';
        el.style.transform = 'translateX(-50%)';
        document.body.appendChild(el);

        // Force reflow
        el.offsetHeight;

        el.style.top = (rect.top - 60) + 'px';
        el.style.opacity = '0';

        setTimeout(() => el.remove(), 1050);
    },

    spawnNextItem() {
        if (this.itemsToSpawn > 0 && this.isPlaying) {
            let delay = 1000;
            if (this.config.speed === 'medium') delay = 800;
            if (this.config.speed === 'fast') delay = 500;
            if (this.config.speed === 'very-fast') delay = 300;
            if (Date.now() < this.slowEffectUntil) {
                delay *= 1.8;
            }

            setTimeout(() => {
                if (this.isPlaying) {
                    const batchSize = Math.min(this.config.spawnBatch || 1, this.itemsToSpawn);
                    for (let i = 0; i < batchSize; i++) {
                        this.spawnItem();
                    }
                    if (this.chapter !== 'cap1' && Math.random() < 0.25) {
                        this.spawnItem(false, true);
                    }
                }
            }, delay);
        }
    },

    startBossMechanic() {
        // T-305: Lixão periodicamente joga um item de volta para o cenário
        this.bossTimer = setInterval(() => {
            if (!this.isPlaying) return;
            this.spawnItem(true);

            const hud = document.getElementById('hud');
            this.showFloatingText('Lixão Atacou!', hud.getBoundingClientRect(), '#F44336');
        }, 5000);
    },

    endPuzzle() {
        this.isPlaying = false;
        if (this.bossTimer) clearInterval(this.bossTimer);

        GameState.data.totalScore += this.score;
        GameState.save();

        const passed = this.determinePass();
        const feedback = this.getPassFeedback();
        const outcome = {
            passed,
            chapter: this.chapter,
            score: this.score,
            marHealth: this.marHealth,
            successRate: this.totalDrops === 0 ? 1 : (this.successfulDrops / this.totalDrops),
            feedback
        };

        if (typeof GameEngine !== 'undefined' && GameEngine) {
            GameEngine.lastPuzzleOutcome = outcome;
            GameEngine.changeState(GameEngine.STATES.RESULTS);
        }

        console.log(`Capítulo concluído! Pontos: ${this.score}, Saúde final do Mar: ${this.marHealth}%, Passou: ${passed}`);
    }
};

window.GamePuzzle = GamePuzzle;
