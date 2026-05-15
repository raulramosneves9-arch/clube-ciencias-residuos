// Gerenciamento de estado e persistência (T-002)

const STORAGE_KEY = 'ecomundo_save';

const defaultState = {
    currentChapter: 1,
    totalScore: 0,
    currentUsername: '',
    settings: {
        soundEnabled: true,
        musicEnabled: true
    }
};

const GameState = {
    data: { ...defaultState },

    // Carrega o estado do localStorage
    load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                // Merge para garantir que novas propriedades do defaultState existam em saves antigos
                this.data = {
                    ...defaultState,
                    ...JSON.parse(saved),
                    settings: { ...defaultState.settings, ...(JSON.parse(saved).settings || {}) }
                };
                console.log("Progresso carregado:", this.data);
            }
        } catch (e) {
            console.error("Erro ao carregar o save:", e);
        }
    },

    // Salva o estado atual no localStorage
    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error("Erro ao salvar o progresso:", e);
        }
    },

    // Reseta o progresso para o estado inicial
    reset() {
        this.data = { ...defaultState };
        this.save();
    },

    // Atualiza um valor na raiz e salva
    update(key, value) {
        this.data[key] = value;
        this.save();
    },

    // Atualiza configurações específicas e salva
    updateSettings(key, value) {
        this.data.settings[key] = value;
        this.save();
    },

    // Define o username do jogador atual
    setUsername(username) {
        this.data.currentUsername = username.trim();
        this.save();
    },

    // Retorna o username atual
    getUsername() {
        return this.data.currentUsername;
    }
};

// Carrega o estado inicial ao carregar o script
GameState.load();

window.GameState = GameState;
