// Gerenciamento de Leaderboard/Ranking (T-401-Leaderboard)

const LEADERBOARD_KEY = 'ecomundo_leaderboard';
const MAX_ENTRIES = 10;
const SAMPLE_ENTRIES = [
    { username: 'Maya', score: 980, date: '11/07/2026' },
    { username: 'Téo', score: 860, date: '10/07/2026' },
    { username: 'Lia', score: 740, date: '09/07/2026' },
    { username: 'Nina', score: 620, date: '08/07/2026' }
];

const GameLeaderboard = {
    data: [],

    // Carrega o ranking do localStorage
    load() {
        try {
            const saved = localStorage.getItem(LEADERBOARD_KEY);
            if (saved) {
                this.data = JSON.parse(saved);
                console.log("Ranking carregado:", this.data);
            } else {
                this.data = SAMPLE_ENTRIES;
            }
        } catch (e) {
            console.error("Erro ao carregar o ranking:", e);
            this.data = SAMPLE_ENTRIES;
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
            return '<p class="leaderboard-empty">Nenhum score registrado ainda. Seja o primeiro!</p>';
        }

        let html = '<table class="leaderboard-table">';
        html += '<thead><tr><th>Posição</th><th>Jogador</th><th>Pontos</th><th>Data</th></tr></thead>';
        html += '<tbody>';

        this.data.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const rowClass = index < 3 ? `leaderboard-row medal-${index + 1}` : 'leaderboard-row';

            html += `<tr class="${rowClass}">`;
            html += `<td class="leaderboard-rank"><span class="leaderboard-rank-badge">${medal ? `${medal} ${index + 1}º` : `${index + 1}º`}</span></td>`;
            html += `<td class="leaderboard-player">${entry.username}</td>`;
            html += `<td class="leaderboard-score">${entry.score}</td>`;
            html += `<td class="leaderboard-date">${entry.date}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }
};

// Carrega o ranking ao iniciar
GameLeaderboard.load();

window.GameLeaderboard = GameLeaderboard;
