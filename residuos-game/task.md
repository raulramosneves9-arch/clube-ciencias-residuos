# TASKS — EcoMundo Mini Game

Documento de tarefas para desenvolvimento do mini game narrativo de puzzle sobre resíduos sólidos.  
Plataforma: **browser**. Stack: **HTML5 + CSS3 + JavaScript** (vanilla ou React).  
Leia o `README.md` antes de iniciar.

---

## FASE 0 — Estrutura do Projeto

- [x] **T-001** Criar estrutura de pastas do projeto:
  ```
  ecomundo/
  ├── index.html
  ├── style.css
  ├── main.js
  ├── assets/
  │   ├── characters/   (SVGs dos personagens)
  │   └── scenes/       (SVGs dos cenários)
  ├── data/
  │   └── chapters.js   (dados dos capítulos e diálogos)
  ├── game/
  │   ├── engine.js     (loop principal)
  │   ├── puzzle.js     (mecânica de triagem)
  │   ├── narrative.js  (sistema de diálogos)
  │   └── state.js      (gerenciamento de estado)
  └── ui/
      ├── hud.js        (barra de saúde do Mar, pontuação)
      └── dialog.js     (caixa de diálogo dos personagens)
  ```

- [x] **T-002** Configurar `localStorage` para persistência de progresso (capítulo atual, pontuação total, configurações de som)

- [x] **T-003** Criar sistema de estados do jogo: `MENU`, `NARRATIVE`, `PUZZLE`, `RESULTS`, `GAMEOVER`

---

## FASE 1 — Assets Visuais (SVG)

> Todos os personagens devem ser desenhados em SVG puro, sem imagens externas.

- [x] **T-101** Desenhar personagem **Lixão** (vilão) em SVG:
  - Saco de lixo escuro com olhos vermelhos maliciosos
  - Estados: `idle` (parado), `attack` (avançando), `defeat` (encolhendo)
  - Paleta: tons de vermelho escuro `#712B13`, `#993C1D`, `#E24B4A`

- [x] **T-102** Desenhar personagem **Recicla** (herói) em SVG:
  - Lata de reciclagem verde com capa de herói e símbolo ♻
  - Estados: `idle`, `running`, `celebrate`
  - Paleta: `#3B6D11`, `#639922`, `#C0DD97`

- [x] **T-103** Desenhar personagem **Compostinha** (aliada) em SVG:
  - Minhoca/folha com antenas vegetais
  - Estados: `idle`, `talking`, `happy`
  - Paleta: `#BA7517`, `#EF9F27`, `#639922`

- [x] **T-104** Desenhar personagem **Ecodetetive** (guia) em SVG:
  - Figura com chapéu detetive, jaleco e lupa
  - Estados: `idle`, `pointing`, `explaining`
  - Paleta: `#3C3489`, `#534AB7`, `#AFA9EC`

- [x] **T-105** Desenhar personagem **Mar** (vítima) em SVG com 5 estados de saúde:
  - `critico` (expressão de choro, muito lixo visível)
  - `ruim` (triste, lixo moderado)
  - `neutro` (expressão neutra, pouco lixo)
  - `bom` (levemente sorrindo, água mais limpa)
  - `otimo` (sorrindo, água azul brilhante, partículas de brilho)

- [x] **T-106** Criar 5 cenários de fundo em SVG:
  - Menu principal (visão geral cidade+mar+floresta)
  - Cidade poluída (Capítulo 1)
  - Oceano (Capítulo 2)
  - Floresta (Capítulo 3)
  - Fábrica de reciclagem (Capítulo 4)
  - Praça final / celebração (Capítulo 5)

- [x] **T-107** Criar ícones SVG dos 5 tipos de resíduo para puzzle:
  - Papel (azul) — jornal, caixa, folha
  - Plástico (vermelho) — garrafa PET, sacola, canudo
  - Metal (amarelo) — lata, tampa, papel alumínio
  - Vidro (verde) — garrafa, pote
  - Orgânico (marrom) — casca de banana, resto de comida
  - Rejeito (cinza) — fralda, cigarro, espelho
  - Pilha/eletrônico (roxo) — pilha, celular quebrado

- [x] **T-108** Criar sprites de animação CSS para os personagens (keyframes de idle bounce, shake, pulse)

---

## FASE 2 — Sistema de Narrativa

- [x] **T-201** Criar arquivo `data/chapters.js` com os dados de todos os capítulos:
  ```js
  // Estrutura esperada:
  {
    id: "cap1",
    title: "O Despertar do Lixão",
    scene: "cidade",
    dialogues: [
      { character: "ecodetetive", text: "...", emotion: "serious" },
      { character: "recicla", text: "...", emotion: "determined" }
    ],
    puzzles: [ /* ver T-301 */ ],
    unlockCondition: null
  }
  ```

- [x] **T-202** Escrever todos os diálogos dos 5 capítulos em português brasileiro:
  - Cada capítulo: 3 diálogos de abertura + 1–2 dicas durante puzzle + 2 diálogos de encerramento
  - Tom: leve, acessível para todas as idades, sem ser infantilizante
  - Incluir fatos reais sobre resíduos nos diálogos do Ecodetetive

- [x] **T-203** Implementar `ui/dialog.js` — caixa de diálogo estilizada:
  - Exibe avatar do personagem falante (SVG miniatura)
  - Nome do personagem + texto com efeito de digitação (typewriter)
  - Botão "continuar" ou avanço automático por tempo
  - Suporte a emoções: muda expressão do avatar conforme `emotion`

- [x] **T-204** Implementar `game/narrative.js` — controlador de narrativa:
  - Fila de diálogos sequenciais
  - Transição suave entre cena narrativa e puzzle
  - Evento de conclusão de capítulo dispara próximo capítulo ou tela de resultados

---

## FASE 3 — Mecânica de Puzzle (Triagem)

- [x] **T-301** Implementar `game/puzzle.js` — motor de triagem:
  - Itens de lixo aparecem no cenário (spawn aleatório ou sequencial por dificuldade)
  - Jogador clica/arrasta item para a lixeira correta
  - Validação: compara `item.type` com `bin.acceptedTypes[]`
  - Acerto: animação de sucesso + pontos + Mar melhora levemente
  - Erro: animação de erro + penalidade leve + Lixão avança levemente

- [x] **T-302** Criar sistema de lixeiras no puzzle:
  - 4–5 lixeiras visíveis simultaneamente (cores padrão CONAMA)
  - Lixeira "highlight" quando item arrastado está sobre ela
  - Lixeira "shake" quando item errado é solto nela

- [x] **T-303** Implementar progressão de dificuldade por capítulo:
  - Cap 1: apenas papel e plástico, itens lentos, 8 itens
  - Cap 2: + metal e vidro, itens com tempo limite, 12 itens
  - Cap 3: + orgânico, itens se movem levemente, 12 itens
  - Cap 4: todos os tipos, itens rápidos, combo system, 15 itens
  - Cap 5: todos os tipos + pilhas/eletrônicos, boss puzzle (Lixão joga lixo de volta), 20 itens

- [x] **T-304** Implementar sistema de combo:
  - 3 acertos seguidos = combo x2
  - 5 acertos seguidos = combo x3 + animação especial
  - Erro quebra o combo

- [x] **T-305** Implementar mecânica do boss (Capítulo 5):
  - Lixão periodicamente joga um item de volta para o cenário
  - Jogador deve "capturar" o item e redestinar corretamente
  - Barra de HP do Lixão vai a zero quando Mar atinge saúde máxima

---

## FASE 4 — HUD e Interface

- [x] **T-401** Implementar `ui/hud.js` — interface durante o jogo:
  - Barra de saúde do Mar (ícone do Mar + barra verde que cresce)
  - Pontuação atual e combo ativo
  - Contador de itens restantes no puzzle
  - Timer (opcional, para capítulos com tempo limite)
  - Ícone do Lixão com "ameaça" que cresce conforme erros

- [x] **T-402** Criar tela de menu principal:
  - Título "EcoMundo" com tipografia marcante
  - Cenário animado de fundo (cidade + mar + personagens idle)
  - Botões: Jogar, Continuar (se houver save), Sobre, Créditos
  - Breve frase motivacional rotativa sobre meio ambiente

- [x] **T-403** Criar tela de resultados de capítulo:
  - Exibe pontuação do capítulo, acertos/erros, tempo
  - Estado atual do Mar (SVG com expressão correspondente)
  - Fato educativo desbloqueado (dica sobre resíduos)
  - Botões: Próximo Capítulo / Jogar Novamente

- [x] **T-404** Criar tela de encerramento / créditos:
  - Celebração: Mar completamente saudável, Recicla comemorando, Lixão derrotado
  - Resumo de impacto: "você destinou X kg de resíduos corretamente!"
  - Compartilhamento: gera texto para copiar e compartilhar
  - Link para fontes reais sobre reciclagem no Brasil

- [x] **T-405** Implementar transições entre telas:
  - Fade in/out suave entre estados
  - Slide lateral entre capítulos
  - Transição de "limpeza" (varredura verde) ao completar capítulo

---

## FASE 5 — Áudio (opcional mas recomendado)

- [x] **T-501** Implementar sons via Web Audio API (sem arquivos externos):
  - Som de acerto: tom curto e positivo
  - Som de erro: som grave curto
  - Som de combo: sequência ascendente
  - Música ambiente: loop generativo simples (beeps rítmicos temáticos)

- [x] **T-502** Botão de mute/unmute no HUD

---

## FASE 6 — Acessibilidade e Polimento

- [x] **T-601** Garantir que o jogo funciona com teclado (Tab + Enter para selecionar lixeiras)
- [x] **T-602** Adicionar `aria-label` em todos os elementos interativos
- [x] **T-603** Garantir contraste mínimo WCAG AA em todos os textos
- [x] **T-604** Testar em mobile (touch events para drag-and-drop)
- [x] **T-605** Garantir que o jogo roda offline (sem dependências de CDN externo em runtime)
- [x] **T-606** Adicionar tela de carregamento (loading) com dica educativa enquanto assets carregam

---

## FASE 7 — Testes e Entrega

- [x] **T-701** Testar fluxo completo dos 5 capítulos do início ao fim
- [x] **T-702** Testar persistência: fechar e reabrir o browser mantém progresso
- [x] **T-703** Testar em Chrome, Firefox e Safari (mínimo)
- [x] **T-704** Testar em viewport mobile 375px e desktop 1280px
- [x] **T-705** Revisar todos os textos de diálogo para clareza e precisão factual
- [x] **T-706** Validar que as cores das lixeiras seguem o padrão CONAMA (Resolução 275/2001)
- [x] **T-707** Gerar build final como pasta estática (sem servidor necessário — apenas `index.html`)

---

## Ordem de Implementação Sugerida

```
T-001 → T-002 → T-003          (estrutura)
T-101 a T-108                  (assets — pode ser paralelo)
T-201 → T-202 → T-203 → T-204 (narrativa)
T-301 → T-302 → T-303          (puzzle core)
T-401 → T-402 → T-403          (HUD e telas)
T-304 → T-305                  (mecânicas avançadas)
T-404 → T-405                  (polimento de UI)
T-501 → T-502                  (áudio, se tempo permitir)
T-601 a T-606                  (acessibilidade)
T-701 a T-707                  (testes)
```

---

## Notas Importantes para a IA Implementadora

- **Não use imagens externas** — todos os visuais devem ser SVG inline ou desenhados via Canvas API
- **Não use frameworks pesados** — HTML/CSS/JS vanilla é suficiente e garante portabilidade
- **A paleta de cores das lixeiras é normativa** (CONAMA 275/2001): papel=azul, plástico=vermelho, metal=amarelo, vidro=verde, orgânico=marrom, rejeito=cinza
- **O tom dos diálogos é leve e inclusivo** — evitar linguagem técnica sem explicação
- **Mar é o termômetro emocional do jogo** — sua expressão deve mudar visivelmente a cada acerto/erro para criar conexão emocional
- **O jogo deve rodar como arquivo estático** — `index.html` aberto diretamente no browser, sem servidor