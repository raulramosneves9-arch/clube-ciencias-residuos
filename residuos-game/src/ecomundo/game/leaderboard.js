// Gerenciamento de Leaderboard/Ranking (T-401-Leaderboard)

const LEADERBOARD_KEY = 'ecomundo_leaderboard';
const MAX_ENTRIES = 10;

const GameLeaderboard = {
    data: [],

    // Carrega o ranking do localStorage
    load() {
        try {
            const saved = localStorage.getItem(LEADERBOARD_KEY);
            if (saved) {
                this.data = JSON.parse(saved);
                console.log("Ranking carregado:", this.data);
            }
        } catch (e) {
            console.error("Erro ao carregar o ranking:", e);
            this.data = [];
        }
    },

    // Salva o ranking no localStorage
    save() {
        try {
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error("Erro ao salvar o ranking:", e);
        }
    },

    // Adiciona um novo score ao ranking
    addScore(username, score) {
        if (!username || username.trim() === '') {
            console.warn("Username vazio, score não foi registrado");
            return false;
        }

        const entry = {
            username: username.trim(),
            score: score,
            date: new Date().toLocaleDateString('pt-BR')
        };

        this.data.push(entry);

        // Ordena por score (descendente)
        this.data.sort((a, b) => b.score - a.score);

        // Mantém apenas os top 10
        this.data = this.data.slice(0, MAX_ENTRIES);

        this.save();
        console.log("Score adicionado ao ranking:", entry);
        return true;
    },

    // Retorna o ranking completo (top 10)
    getTop() {
        return this.data;
    },

    // Retorna a posição de um score específico
    getPosition(score) {
        const index = this.data.findIndex(entry => entry.score === score);
        return index !== -1 ? index + 1 : null;
    },

    // Limpa todo o ranking
    clear() {
        this.data = [];
        localStorage.removeItem(LEADERBOARD_KEY);
        console.log("Ranking foi limpo");
    },

    // Retorna HTML formatado do ranking para exibição
    getHTML() {
        if (this.data.length === 0) {
            return '<p style="text-align: center; color: #999;">Nenhum score registrado ainda. Seja o primeiro!</p>';
        }

        let html = '<table class="leaderboard-table" style="width: 100%; margin: 20px 0; border-collapse: collapse;">';
        html += '<thead style="background-color: #2E7D32; color: white;">';
        html += '<tr><th style="padding: 10px; border: 1px solid #ddd;">Posição</th><th style="padding: 10px; border: 1px solid #ddd;">Jogador</th><th style="padding: 10px; border: 1px solid #ddd;">Pontos</th><th style="padding: 10px; border: 1px solid #ddd;">Data</th></tr>';
        html += '</thead><tbody>';

        this.data.forEach((entry, index) => {
            const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
            html += `<tr style="background-color: ${bgColor};">`;
            html += `<td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${index + 1}º</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${entry.username}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${entry.score}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${entry.date}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }
};

// Carrega o ranking ao iniciar
GameLeaderboard.load();

window.GameLeaderboard = GameLeaderboard;
