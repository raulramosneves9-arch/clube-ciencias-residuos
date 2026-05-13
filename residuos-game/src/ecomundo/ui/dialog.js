// Controlador de UI para a caixa de diálogos (T-203)

const DialogUI = {
    container: null,
    isTypewriting: false,
    typewriterInterval: null,
    onCompleteCallback: null,

    init() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        // Se já existe no DOM, apenas recupera a referência
        const existing = document.getElementById('dialog-ui');
        if (existing) {
            this.container = existing;
            return;
        }

        // Cria estrutura do dialog
        this.container = document.createElement('div');
        this.container.id = 'dialog-ui';
        this.container.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 800px;
            background: rgba(255, 255, 255, 0.95);
            border: 4px solid #3B6D11;
            border-radius: 16px;
            padding: 20px;
            display: none;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 20px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            font-family: Arial, sans-serif;
            pointer-events: auto;
        `;

        const avatarContainer = document.createElement('div');
        avatarContainer.id = 'dialog-avatar';
        avatarContainer.style.cssText = `
            width: 100px;
            height: 100px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const textContainer = document.createElement('div');
        textContainer.style.cssText = `
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        `;

        const nameLabel = document.createElement('div');
        nameLabel.id = 'dialog-name';
        nameLabel.style.cssText = `
            font-weight: bold;
            font-size: 1.2rem;
            color: #3C3489;
            margin-bottom: 8px;
            text-transform: capitalize;
        `;

        const textLabel = document.createElement('div');
        textLabel.id = 'dialog-text';
        textLabel.style.cssText = `
            font-size: 1.1rem;
            color: #333;
            line-height: 1.6;
            min-height: 50px;
            white-space: pre-wrap;
            word-break: break-word;
            letter-spacing: 0.01em;
        `;

        const nextBtn = document.createElement('button');
        nextBtn.id = 'dialog-next-btn';
        nextBtn.innerText = 'Continuar ▼';
        nextBtn.style.cssText = `
            align-self: flex-end;
            margin-top: 10px;
            padding: 8px 16px;
            background: #639922;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.1s;
        `;
        nextBtn.addEventListener('mousedown', () => nextBtn.style.transform = 'scale(0.95)');
        nextBtn.addEventListener('mouseup', () => nextBtn.style.transform = 'scale(1)');
        
        // Acessibilidade
        nextBtn.tabIndex = 0;
        nextBtn.setAttribute('aria-label', 'Continuar diálogo');
        
        // Clique no botão ou no container avança o diálogo
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleNext();
        });
        this.container.addEventListener('click', () => this.handleNext());

        textContainer.appendChild(nameLabel);
        textContainer.appendChild(textLabel);
        textContainer.appendChild(nextBtn);

        this.container.appendChild(avatarContainer);
        this.container.appendChild(textContainer);

        gameContainer.appendChild(this.container);
    },

    show(character, text, emotion, callback) {
        // Garante que o container existe e está no DOM
        if (!this.container || !document.getElementById('dialog-ui')) {
            this.init();
        } else if (this.container && !document.body.contains(this.container)) {
            // Se o container existe mas foi removido (ex: innerHTML = ''), re-anexa
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) gameContainer.appendChild(this.container);
        }
        
        if (!this.container) return; // Fail safe

        this.onCompleteCallback = callback;
        this.container.style.display = 'flex';
        // Pequeno delay pra ativar a transição
        setTimeout(() => {
            if (this.container) this.container.style.opacity = '1';
        }, 10);

        const nameLabel = this.container.querySelector('#dialog-name');
        if (nameLabel) nameLabel.innerText = character;
        
        // Carrega o SVG do personagem
        const avatarContainer = this.container.querySelector('#dialog-avatar');
        if (avatarContainer) {
            avatarContainer.innerHTML = '';
            const img = document.createElement('img');
            img.src = `assets/characters/${character}.svg`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            // Aplica classe de animação dependendo da emoção
            if (emotion === 'idle' || emotion === 'neutro') img.className = 'anim-idle';
            if (emotion === 'happy' || emotion === 'celebrate' || emotion === 'otimo') img.className = 'anim-bounce';
            if (emotion === 'critico' || emotion === 'ruim' || emotion === 'attack') img.className = 'anim-shake';
            if (emotion === 'explaining' || emotion === 'pointing' || emotion === 'bom') img.className = 'anim-pulse';
            avatarContainer.appendChild(img);
        }

        const textLabel = this.container.querySelector('#dialog-text');
        if (textLabel) {
            textLabel.textContent = '';
            this.typewrite(text, textLabel);
        }
    },

    typewrite(fullText, element) {
        if (this.typewriterInterval) clearInterval(this.typewriterInterval);
        
        this.isTypewriting = true;
        this.fullTextToType = fullText;
        this.targetElement = element;
        
        let i = 0;
        this.typewriterInterval = setInterval(() => {
            element.textContent += fullText.charAt(i);
            i++;
            if (i >= fullText.length) {
                this.completeTypewriter();
            }
        }, 30); // Velocidade do texto
    },

    completeTypewriter() {
        if (this.typewriterInterval) clearInterval(this.typewriterInterval);
        if (this.targetElement && this.fullTextToType) {
            this.targetElement.textContent = this.fullTextToType;
        }
        this.isTypewriting = false;
    },

    handleNext() {
        if (this.isTypewriting) {
            // Se estiver digitando, apenas completa o texto instantaneamente
            this.completeTypewriter();
        } else {
            // Se já terminou, chama o callback de continuação
            if (this.onCompleteCallback) {
                const cb = this.onCompleteCallback;
                this.onCompleteCallback = null;
                cb();
            }
        }
    },

    hide() {
        if (this.container) {
            this.container.style.opacity = '0';
            setTimeout(() => {
                if (this.container.style.opacity === '0') {
                    this.container.style.display = 'none';
                }
            }, 300);
        }
    }
};

window.DialogUI = DialogUI;
