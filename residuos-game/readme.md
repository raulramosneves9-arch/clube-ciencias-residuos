# 🌍 EcoMundo — Mini Game de Conscientização Ambiental

Mini game narrativo de puzzle para browser, focado em conscientizar jogadores sobre o descarte irregular de resíduos sólidos.

## Visão Geral

EcoMundo é um jogo de puzzle com narrativa emocional onde o jogador acompanha a jornada de **Recicla** — um herói guardião — que precisa salvar o **Mar** (oceano personificado e triste) do caos causado pelo vilão **Lixão**. Ao longo dos capítulos, o jogador aprende sobre tipos de resíduos, coleta seletiva e compostagem, guiado pelo **Ecodetetive** e auxiliado pela **Compostinha**.

## Personagens

| Personagem | Papel | Função no jogo |
|---|---|---|
| **Lixão** | Vilão principal | Contamina zonas do mapa; representa o descarte irregular |
| **Recicla** | Herói guardião | Personagem controlado (indiretamente) pelo jogador |
| **Compostinha** | Aliada orgânica | Ajuda em fases de resíduos orgânicos; dá dicas |
| **Ecodetetive** | Guia / narrador | Tutorial vivo; explica tipos de resíduos e consequências |
| **Mar** | Vítima a salvar | Barra de saúde visual; fica mais saudável conforme o progresso |

## Mecânica Principal

O jogo combina **puzzle de triagem** com **narrativa em capítulos**:

1. **Triagem de Resíduos** — itens caem ou aparecem no cenário; o jogador arrasta/clica para destinar ao local correto (papel, plástico, metal, orgânico, rejeito)
2. **Salve o Mar** — a cada acerto, o Mar recupera saúde e sua expressão muda (triste → neutro → sorrindo)
3. **Narrativa por capítulos** — entre as fases de puzzle, diálogos curtos entre os personagens avançam a história e ensinam fatos reais sobre resíduos

## Estrutura de Capítulos Sugerida

- **Capítulo 1 — O Despertar do Lixão**: introdução dos personagens; puzzle básico de triagem na cidade
- **Capítulo 2 — O Mar Pede Socorro**: fases no oceano; coleta de resíduos flutuantes
- **Capítulo 3 — A Floresta Envenenada**: resíduos orgânicos e compostagem com Compostinha
- **Capítulo 4 — A Fábrica do Recicla**: mecânica avançada; cadeia produtiva da reciclagem
- **Capítulo 5 — O Grande Confronto**: boss fight simbólico contra o Lixão; puzzle final multi-tipo

## Stack Técnica

- **Plataforma**: Browser (sem instalação)
- **Tecnologia**: HTML5 + CSS3 + JavaScript vanilla (sem frameworks obrigatórios) ou React
- **Assets visuais**: SVG desenhado em código (personagens e cenários)
- **Áudio**: opcional; efeitos simples via Web Audio API
- **Persistência**: `localStorage` para salvar progresso entre sessões
- **Responsividade**: funciona em desktop e mobile (touch events)

## Paleta de Cores

```
Verde (Recicla / natureza):  #639922 / #3B6D11
Azul  (Mar / oceano):        #378ADD / #185FA5
Vermelho (Lixão / perigo):   #E24B4A / #A32D2D
Âmbar (Compostinha):         #EF9F27 / #BA7517
Roxo  (Ecodetetive):         #534AB7 / #3C3489
```

## Referências e Inspirações

- Tipos de resíduos: ABNT NBR 10.004 (resíduos sólidos)
- Coleta seletiva: cores padrão CONAMA (papel=azul, plástico=vermelho, metal=amarelo, vidro=verde, orgânico=marrom)
- Referências de jogo educativo: Duolingo (narrativa leve), Cut the Rope (física de puzzle simples)

## Métricas de Sucesso

- Jogador consegue nomear pelo menos 4 tipos de resíduos ao final
- Taxa de conclusão do Capítulo 1 > 80%
- Tempo médio por sessão: 5–15 minutos