// T-501: Áudio via Web Audio API
const GameAudio = {
    ctx: null,
    isPlayingMusic: false,
    musicInterval: null,
    tempo: 120, // BPM

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playTone(freq, type, duration, vol = 5.5) {
        if (!GameState.data.settings.soundEnabled) return;
        this.init();
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playSuccess() {
        // Tom curto e positivo
        this.playTone(440, 'sine', 0.1, 0.1); // A4
        setTimeout(() => this.playTone(554.37, 'sine', 0.1, 0.1), 100); // C#5
        setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 200); // E5
    },

    playError() {
        // Som grave curto
        this.playTone(150, 'sawtooth', 0.3, 0.2);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.2), 100);
    },

    playCombo(multiplier) {
        // Sequência ascendente rápida
        const baseFreq = 440 + (multiplier * 50);
        this.playTone(baseFreq, 'square', 0.1, 0.05);
        setTimeout(() => this.playTone(baseFreq * 1.25, 'square', 0.1, 0.05), 50);
        setTimeout(() => this.playTone(baseFreq * 1.5, 'square', 0.2, 0.05), 100);
    },

    startMusic() {
        if (!GameState.data.settings.musicEnabled) return;
        this.init();
        this.resume();

        if (this.isPlayingMusic) return;
        this.isPlayingMusic = true;

        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // Dó maior

        this.musicInterval = setInterval(() => {
            if (!this.isPlayingMusic || !GameState.data.settings.musicEnabled) {
                this.stopMusic();
                return;
            }

            // Loop generativo simples
            if (Math.random() > 0.3) {
                const note = notes[Math.floor(Math.random() * notes.length)];
                this.playTone(note / 2, 'sine', 0.2, 0.03); // Tom base mais baixo e suave
            }

        }, 60000 / this.tempo);
    },

    stopMusic() {
        this.isPlayingMusic = false;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    },

    toggleSound() {
        const isEnabled = !GameState.data.settings.soundEnabled;
        GameState.updateSettings('soundEnabled', isEnabled);
        return isEnabled;
    },

    toggleMusic() {
        const isEnabled = !GameState.data.settings.musicEnabled;
        GameState.updateSettings('musicEnabled', isEnabled);
        if (isEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        return isEnabled;
    }
};

window.GameAudio = GameAudio;
