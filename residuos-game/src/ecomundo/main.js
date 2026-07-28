// Entry point do jogo
console.log("EcoMundo iniciado");

const tips = [
    "Dica: Lave as embalagens antes de descartar no reciclável!",
    "Dica: Papel engordurado não pode ser reciclado, jogue no rejeito.",
    "Dica: Pilhas contêm metais pesados e devem ter descarte especial.",
    "Dica: O vidro é 100% reciclável e pode ser reutilizado infinitas vezes."
];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('game-container');
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    container.innerHTML = `
        <div id="loading-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #2E7D32; color: white; font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1 style="font-size: 3rem; margin-bottom: 20px;" class="anim-pulse">Carregando EcoMundo...</h1>
            <p style="font-size: 1.2rem; font-style: italic; max-width: 600px;">${randomTip}</p>
        </div>
    `;

    // Esperar o carregamento de todos os assets da janela
    window.addEventListener('load', () => {
        // Pequeno delay para garantir que a tela de loading seja vista e suave
        setTimeout(() => {
            if (window.GameEngine && window.EcoViewController) {
                GameEngine.init();
            }
        }, 1500);
    });
});
