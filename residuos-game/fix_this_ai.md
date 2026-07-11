# Fixes Required for EcoMundo Game

This document outlines the known issues and technical debts in the EcoMundo project that need to be addressed by the AI.

## 1. Vue.js Error in `App.vue`
- **File**: `src/App.vue`
- **Location**: Line 33 `<main :class="themeClass">`
- **Issue**: The variable `themeClass` is not defined in the `<script setup>` block, which causes a Vue reactivity warning/error.
- **Action Required**: Either define `const themeClass = ref('')` in the script block or remove the `:class="themeClass"` binding if it is no longer used.

## 2. Placeholder Text in About Screen
- **File**: `src/ecomundo/game/engine.js`
- **Location**: `renderAbout(container)` function.
- **Issue**: The screen contains placeholder texts like `[Descreva aqui...]`, `[seu-email@exemplo.com]`, `[seu-telefone]`.
- **Action Required**: Replace all bracketed placeholder texts with the real club information (EcoCientistas Visionários).

## 3. Accidental Progress Loss
- **File**: `src/ecomundo/game/engine.js`
- **Location**: `startGame()` function.
- **Issue**: Clicking the "Jogar" button immediately calls `GameState.reset()`, overwriting any existing saved game in LocalStorage.
- **Action Required**: Add a conditional check. If a save exists (e.g., `GameState.data.currentChapter > 1`), display a confirmation dialog before resetting the game.

## 4. Undefined Puzzle Outcomes
- **File**: `src/ecomundo/game/engine.js`
- **Location**: `renderResults(container)` function.
- **Issue**: It relies on `this.lastPuzzleOutcome`. If `GamePuzzle` fails to set `GameEngine.lastPuzzleOutcome` correctly before transitioning to the `RESULTS` state, the game will default to `{ passed: true, feedback: 'Capítulo concluído!' }` and potentially break the point-scoring mechanics.
- **Action Required**: Ensure that `this.lastPuzzleOutcome` is strictly managed and validate that the puzzle logic always sets this variable before calling `changeState(STATES.RESULTS)`.

## 5. Architectural Debt (Vue vs Vanilla JS)
- **File**: Entire `src/ecomundo` directory.
- **Issue**: The project is set up as a Vue 3 application, but the core game loop and screens inject raw HTML using `innerHTML` instead of utilizing Vue components.
- **Action Required (Optional/Low Priority)**: Refactor the game engine screens (Menu, About, Narrative, etc.) into proper Vue (`.vue`) components to properly leverage the framework's reactivity and avoid DOM conflicts.
