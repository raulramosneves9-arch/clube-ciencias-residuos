// Controlador de Narrativa (T-204)

const GameNarrative = {
    currentChapterData: null,
    dialogueQueue: [],
    currentPhase: null, // 'open', 'hint', 'end'

    init() {
        console.log("GameNarrative inicializado.");
        DialogUI.init();
    },

    start(chapterNumber) {
        const chapterId = 'cap' + chapterNumber;
        this.currentChapterData = window.ChaptersData[chapterId];
        if (!this.currentChapterData) {
            console.error("Capítulo não encontrado:", chapterId);
            return;
        }

        console.log(`Iniciando capítulo: ${this.currentChapterData.title}`);
        
        // Define cenário
        const container = document.getElementById('game-container');
        container.style.backgroundImage = `url('assets/scenes/${this.currentChapterData.scene}.svg')`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        
        this.playOpeningDialogues();
    },

    playOpeningDialogues() {
        this.currentPhase = 'open';
        // Filtra apenas diálogos que não são hint nem end
        this.dialogueQueue = this.currentChapterData.dialogues.filter(d => !d.isHint && !d.isEnd);
        this.nextDialogue();
    },

    playHintDialogue(callback) {
        this.currentPhase = 'hint';
        this.dialogueQueue = this.currentChapterData.dialogues.filter(d => d.isHint);
        this.onSequenceEnd = callback;
        this.nextDialogue();
    },

    playEndingDialogues(callback) {
        this.currentPhase = 'end';
        this.dialogueQueue = this.currentChapterData.dialogues.filter(d => d.isEnd);
        this.onSequenceEnd = callback;
        this.nextDialogue();
    },

    nextDialogue() {
        if (this.dialogueQueue.length > 0) {
            const dialogue = this.dialogueQueue.shift();
            DialogUI.show(dialogue.character, dialogue.text, dialogue.emotion, () => {
                this.nextDialogue();
            });
        } else {
            DialogUI.hide();
            this.handleSequenceEnd();
        }
    },

    handleSequenceEnd() {
        if (this.currentPhase === 'open') {
            console.log("Diálogos de abertura terminados. Transição para PUZZLE.");
            if (window.GameEngine) {
                window.GameEngine.changeState(window.GameEngine.STATES.PUZZLE);
            }
        } else if (this.currentPhase === 'hint' || this.currentPhase === 'end') {
            if (this.onSequenceEnd) {
                const cb = this.onSequenceEnd;
                this.onSequenceEnd = null;
                cb();
            } else if (this.currentPhase === 'end') {
                console.log("Fim do capítulo. Transição para RESULTS.");
                if (window.GameEngine) {
                    window.GameEngine.changeState(window.GameEngine.STATES.RESULTS);
                }
            }
        }
    }
};

window.GameNarrative = GameNarrative;
