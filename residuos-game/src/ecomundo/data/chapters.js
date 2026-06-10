const ChaptersData = {
    cap1: {
        id: "cap1",
        title: "A Cidade Poluída",
        description: "Ruas sujas e fumaça: o primeiro desafio é salvar a cidade separando papel e plástico corretamente.",
        scene: "cidade",
        dialogues: [
            { character: "ecodetetive", text: "Vejam só essa cidade! O Lixão está espalhando sujeira por toda parte!", emotion: "explaining" },
            { character: "recicla", text: "Não se preocupe, nós vamos organizar isso. Papel no azul, plástico no vermelho!", emotion: "running" },
            { character: "mar", text: "Estou me sentindo muito mal com tanta poluição...", emotion: "critico" },
            { character: "ecodetetive", text: "Lembre-se: caixas de papelão vão na lixeira azul!", emotion: "pointing", isHint: true },
            { character: "recicla", text: "Bom trabalho! A cidade já está respirando melhor.", emotion: "celebrate", isEnd: true },
            { character: "mar", text: "Obrigado... já consigo ver um pouco de esperança.", emotion: "ruim", isEnd: true }
        ],
        puzzles: {
            difficulty: 1,
            itemTypes: ["papel", "plastico"],
            itemCount: 20,
            speed: "slow",
            spawnBatch: 2,
            requiredScore: 100,
            requiredMarHealth: 70
        },
        unlockCondition: null
    },
    cap2: {
        id: "cap2",
        title: "Perigo no Oceano",
        description: "O lixo do mar está ameaçando os peixes. Separe vidro, metal, plástico e papel com cuidado.",
        scene: "oceano",
        dialogues: [
            { character: "ecodetetive", text: "Oh não! O Lixão chegou ao oceano. Precisamos agir rápido antes que mais vida marinha sofra.", emotion: "pointing" },
            { character: "recicla", text: "Agora temos metal e vidro também! Metal no amarelo, vidro no verde.", emotion: "idle" },
            { character: "lixao", text: "Vocês nunca vão conseguir limpar tudo isso! Hahaha!", emotion: "attack" },
            { character: "ecodetetive", text: "Cuidado com os vidros quebrados, eles vão na lixeira verde.", emotion: "explaining", isHint: true },
            { character: "recicla", text: "Conseguimos! O oceano está mais limpo.", emotion: "celebrate", isEnd: true },
            { character: "mar", text: "Estou me sentindo bem melhor. A água está mais clara!", emotion: "neutro", isEnd: true }
        ],
        puzzles: {
            difficulty: 2,
            itemTypes: ["papel", "plastico", "metal", "vidro"],
            itemCount: 28,
            hasTimer: true,
            speed: "medium",
            spawnBatch: 2,
            requiredScore: 180,
            requiredMarHealth: 65
        },
        unlockCondition: "cap1"
    },
    cap3: {
        id: "cap3",
        title: "A Força da Natureza",
        description: "A floresta precisa de você. Orgânicos voltam à vida e ajudam a natureza a se recuperar.",
        scene: "floresta",
        dialogues: [
            { character: "compostinha", text: "Olá, amigos! A floresta precisa de nós. Os resíduos orgânicos podem virar adubo para as plantas!", emotion: "happy" },
            { character: "ecodetetive", text: "Isso mesmo, Compostinha! Cascas e restos de comida vão na lixeira marrom.", emotion: "explaining" },
            { character: "lixao", text: "O que é isso? Adubo? Eu prefiro tudo misturado para apodrecer!", emotion: "idle" },
            { character: "compostinha", text: "Lembrem-se: casca de banana vai na lixeira marrom, comigo!", emotion: "talking", isHint: true },
            { character: "compostinha", text: "Que maravilha! As plantas estão agradecendo.", emotion: "happy", isEnd: true },
            { character: "mar", text: "Até as águas que correm para mim estão mais puras agora.", emotion: "bom", isEnd: true }
        ],
        puzzles: {
            difficulty: 3,
            itemTypes: ["papel", "plastico", "metal", "vidro", "organico"],
            itemCount: 32,
            speed: "medium",
            movement: "wave",
            spawnBatch: 3,
            requiredScore: 240,
            requiredMarHealth: 60
        },
        unlockCondition: "cap2"
    },
    cap4: {
        id: "cap4",
        title: "Renovação Total",
        description: "Na fábrica de reciclagem, cada item conta. Separa rejeitos e mostre que reciclar vale a pena.",
        scene: "fabrica",
        dialogues: [
            { character: "recicla", text: "Chegamos à fábrica de reciclagem. Aqui tudo ganha uma nova vida!", emotion: "celebrate" },
            { character: "ecodetetive", text: "Atenção máxima, agora temos que separar todos os tipos de resíduos e os rejeitos vão na cinza.", emotion: "explaining" },
            { character: "lixao", text: "Rejeitos? É disso que eu gosto! Fraldas, chicletes... coisas que não servem para mais nada!", emotion: "attack" },
            { character: "ecodetetive", text: "O lixo de banheiro e espelhos quebrados são rejeitos, lixeira cinza neles!", emotion: "pointing", isHint: true },
            { character: "recicla", text: "Tudo triado perfeitamente! Vocês são incríveis.", emotion: "celebrate", isEnd: true },
            { character: "mar", text: "Eu nunca me senti tão revigorado! Quanta energia positiva!", emotion: "otimo", isEnd: true }
        ],
        puzzles: {
            difficulty: 4,
            itemTypes: ["papel", "plastico", "metal", "vidro", "organico", "rejeito"],
            itemCount: 40,
            speed: "fast",
            comboSystem: true,
            spawnBatch: 3,
            requiredScore: 320,
            requiredMarHealth: 55
        },
        unlockCondition: "cap3"
    },
    cap5: {
        id: "cap5",
        title: "O Confronto Final",
        description: "A praça da cidade é o palco do duelo final. Derrube o Lixão e prove que a reciclagem venceu.",
        scene: "praca",
        dialogues: [
            { character: "ecodetetive", text: "Este é o confronto final! O Lixão está tentando tomar a praça da cidade.", emotion: "pointing" },
            { character: "recicla", text: "Vamos usar tudo o que aprendemos e também separar pilhas e eletrônicos no roxo!", emotion: "running" },
            { character: "lixao", text: "Eu não vou desistir! Vou jogar o lixo de volta em vocês!", emotion: "attack" },
            { character: "ecodetetive", text: "Baterias e eletrônicos contêm metais pesados, coloque-os na lixeira roxa!", emotion: "explaining", isHint: true },
            { character: "recicla", text: "Vencemos! O Lixão foi derrotado e a praça está limpa.", emotion: "celebrate", isEnd: true },
            { character: "mar", text: "Agradeço a todos vocês! O EcoMundo está a salvo e a natureza em equilíbrio!", emotion: "otimo", isEnd: true }
        ],
        puzzles: {
            difficulty: 5,
            itemTypes: ["papel", "plastico", "metal", "vidro", "organico", "rejeito", "eletronico"],
            itemCount: 20,
            speed: "fast",
            comboSystem: true,
            bossMechanic: true
        },
        unlockCondition: "cap4"
    }
};

// Exportar para ser acessível globalmente
window.ChaptersData = ChaptersData;
