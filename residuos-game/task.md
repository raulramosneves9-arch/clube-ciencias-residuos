# TASKS — SaneamentoTale (Estilo Undertale)

Documento de tarefas para o protótipo de batalha focado em Saneamento Básico.

## FASE 1 — Estrutura e Limpeza
- ( ) Limpar código antigo de resíduos sólidos (remover `puzzle.js` e lixeiras)
- ( ) Criar estrutura para o `BattleEngine.js` (gerenciador de turnos)
- ( ) Mudar estilo visual para fundo preto com bordas brancas (estilo retrô)

## FASE 2 — Menu de Turnos (Turno do Jogador)
- ( ) Criar UI dos botões: `[ ATACAR ]`, `[ AGIR ]`, `[ ITEM ]`, `[ POUPAR ]`
- ( ) Criar a caixa de diálogo com efeito máquina de escrever
- ( ) Implementar lógica do menu `[ AGIR ]` (ex: "Analisar", "Limpar Cano")

## FASE 3 — Sistema Bullet Hell (Turno do Inimigo)
- ( ) Criar Canvas para a "Caixa de Batalha"
- ( ) Adicionar o personagem do jogador (uma "Gotinha" ou Coração) que se move com setas do teclado
- ( ) Implementar sistema de colisão e perda de vida
- ( ) Criar padrão de ataque do inimigo (ex: gotas ácidas caindo na caixa)

## FASE 4 — A Batalha (Monstro do Esgoto)
- ( ) Criar visual (SVG ou CSS) do Monstro do Esgoto no topo da tela
- ( ) Escrever diálogos divertidos do inimigo reagindo às suas ações
- ( ) Implementar condição de vitória (resolver o problema do esgoto pacificamente)

## FASE 5 — Polimento
- ( ) Adicionar tela de Game Over
- ( ) Sons estilo 8-bit (bipes para texto, hit para dano)
- ( ) Balanceamento da dificuldade dos ataques