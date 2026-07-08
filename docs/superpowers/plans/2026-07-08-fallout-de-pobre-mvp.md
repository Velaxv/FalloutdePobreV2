# Fallout de Pobre V2 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable post-apocalyptic tropical survival RPG prototype featuring CRT styling, a node-based dialogue store, player stats/stress tracking, and stance-based combat.

**Architecture:** The game uses a centralized Zustand store for player stats, inventory, and combat state, rendering screens dynamically based on the current active node ID in a game graph. Lógica narrativas, inventário e combate são reativos e estritamente separados por componentes dedicados.

**Tech Stack:** React 18+, Vite, Zustand, Vitest (for unit testing), CSS Vanilla.

## Global Constraints
- Target platform: Web (Modern desktop and mobile browsers).
- Styling methodology: CSS Vanilla only (no Tailwind, custom variables for color scheme, scanlines, and CRT styling).
- Language: JavaScript (ES6 Modules).
- Zero placeholders: All implementations must be fully specified.
- Commit frequently at the end of each task.

---

### Task 1: Scaffolding and Cleanup

**Files:**
- Create: `package.json` (scaffolded)
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`
- Modify: `src/index.css`
- Delete: `src/App.css`, `src/assets/react.svg`

**Interfaces:**
- Consumes: None (initial setup)
- Produces: Base React project structure with Vite running

- [ ] **Step 1: Scaffold Vite project in current directory**
  
  Run: `npx -y create-vite@latest ./ --template react`
  Expected: Scaffold completed, package.json and src folders created.

- [ ] **Step 2: Clean up template boilerplate**
  
  Delete files: `src/App.css` and `src/assets/react.svg`.
  Modify `src/main.jsx` to import global CSS and mount `App` cleanly.
  
  Modify: `src/main.jsx`
  ```javascript
  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App'
  import './styles/main.css'

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  ```

- [ ] **Step 3: Create folder directory layout**
  
  Create folders:
  - `src/components`
  - `src/data`
  - `src/store`
  - `src/styles`

- [ ] **Step 4: Write base CSS global variables**
  
  Create: `src/styles/main.css`
  ```css
  :root {
    --color-phosphor-green: #33ff33;
    --color-phosphor-green-dim: #116611;
    --color-orange-rust: #d97706;
    --color-bg-dark: #0a0f0a;
    --color-sepia: #78350f;
    --font-terminal: 'Courier New', Courier, monospace;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(--color-bg-dark);
    color: var(--color-phosphor-green);
    font-family: var(--font-terminal);
    overflow: hidden;
  }
  ```

- [ ] **Step 5: Write minimal App.jsx component**
  
  Modify: `src/App.jsx`
  ```javascript
  import React from 'react'

  export default function App() {
    return (
      <div className="app-container">
        <h1>Fallout de Pobre V2</h1>
      </div>
    )
  }
  ```

- [ ] **Step 6: Verify development build runs**
  
  Run: `npm install`
  Run: `npm run build`
  Expected: Successful production build without errors.

- [ ] **Step 7: Commit**
  
  ```bash
  git add .
  git commit -m "feat: scaffold react project and configure folder structure"
  ```

---

### Task 2: Narrative Node Graph and Zustand Game Store

**Files:**
- Create: `src/data/nodes.js`
- Create: `src/store/useGameStore.js`
- Create: `src/store/useGameStore.test.js`

**Interfaces:**
- Consumes: None (core engine data layer)
- Produces: `nodes` dictionary mapping IDs to `GameNode` specs, and `useGameStore` Zustand hook for React components.

- [ ] **Step 1: Create nodes.js with story graph**
  
  Create: `src/data/nodes.js`
  ```javascript
  export const nodes = {
    "inicio_congresso": {
      id: "inicio_congresso",
      type: "narrative",
      text: "Você acorda com o som estático de um orelhão tocando ao longe. O sol de fim de tarde incide sobre a cúpula descascada do Congresso Nacional, agora uma ilha cercada por águas verdes e borbulhantes.",
      choices: [
        {
          text: "Atender o orelhão (-1 Ficha)",
          nextNodeId: "orelhao_misterioso",
          requirements: { currency: 1 },
          effects: { currency: -1, stress: 5 }
        },
        {
          text: "Ignorar e vasculhar um Opala enferrujado próximo",
          nextNodeId: "revirar_opala",
          effects: { scrap: 3, thirst: 15 }
        }
      ]
    },
    "orelhao_misterioso": {
      id: "orelhao_misterioso",
      type: "narrative",
      text: "Uma voz rouca no orelhão avisa: 'Eles estão patrulhando a Esplanada. Pegue a machete no orelhão de trás.' Você encontra uma Machete Enferrujada no chão da cabine.",
      choices: [
        {
          text: "Equipar a Machete e avançar para a Esplanada",
          nextNodeId: "combate_milicia",
          effects: { hasMachete: true }
        }
      ]
    },
    "revirar_opala": {
      id: "revirar_opala",
      type: "narrative",
      text: "No porta-malas do Opala, você encontra uma garrafa rosa brilhante de Guaraná Jesus e algumas sucatas. Mas o esforço te dá sede.",
      choices: [
        {
          text: "Pegar itens e ir para a Esplanada",
          nextNodeId: "combate_milicia",
          effects: { scrap: 2, hasGuarana: true }
        }
      ]
    },
    "combate_milicia": {
      id: "combate_milicia",
      type: "combat",
      text: "Um Capanga da Bossa Nova com jaqueta desbotada bloqueia a avenida. 'Pedágio da Esplanada! Pague 5 fichas ou morra!'",
      enemy: {
        name: "Capanga da Bossa Nova",
        health: 40,
        maxHealth: 40,
        stressAttack: 10,
        position: "Média"
      },
      onWinNodeId: "vitoria_milicia",
      onLoseNodeId: "morte_wasteland"
    },
    "vitoria_milicia": {
      id: "vitoria_milicia",
      type: "narrative",
      text: "O capanga foge deixando 3 Fichas de Orelhão para trás. A Esplanada das Ruínas está aberta diante de você. Fim da demonstração.",
      choices: []
    },
    "morte_wasteland": {
      id: "morte_wasteland",
      type: "narrative",
      text: "Seu corpo sucumbiu à rigidez da terra devastada. Seu rádio emite apenas estática. Fim de jogo.",
      choices: []
    }
  };
  ```

- [ ] **Step 2: Create useGameStore.js store definition**
  
  Create: `src/store/useGameStore.js`
  ```javascript
  import { create } from 'zustand';
  import { nodes } from '../data/nodes';

  const initialPlayer = {
    health: 100,
    maxHealth: 100,
    stress: 0,
    radiation: 0,
    hunger: 20,
    thirst: 20,
    currency: 3, // Fichas
    scrap: 5,
    ammo: 2
  };

  export const useGameStore = create((set, get) => ({
    player: { ...initialPlayer },
    inventory: [
      { id: "guarana_jesus", name: "Guaraná Jesus", quantity: 1, type: "consumable", effect: { thirst: -30, stress: -20 } }
    ],
    currentNodeId: "inicio_congresso",
    combatState: null, // { enemyHealth, playerStance: 'Cover'|'Melee'|'Ranged', log: [] }

    changeNode: (nodeId) => {
      const node = nodes[nodeId];
      if (!node) return;
      
      // Se for nó de combate, inicializa o estado de combate
      let combatState = null;
      if (node.type === 'combat') {
        combatState = {
          enemyHealth: node.enemy.health,
          playerStance: 'Cover',
          log: ["Combate Iniciado! Você está em postura de Abrigo (Cover)."]
        };
      }

      set((state) => {
        const nextThirst = Math.min(100, state.player.thirst + 5);
        const nextHunger = Math.min(100, state.player.hunger + 3);
        
        return {
          currentNodeId: nodeId,
          combatState,
          player: {
            ...state.player,
            thirst: nextThirst,
            hunger: nextHunger
          }
        };
      });
    },

    modifyPlayerStat: (stat, val) => {
      set((state) => ({
        player: {
          ...state.player,
          [stat]: Math.max(0, Math.min(state.player.maxHealth || 100, state.player[stat] + val))
        }
      }));
    },

    addItemToInventory: (item) => {
      set((state) => {
        const existing = state.inventory.find(i => i.id === item.id);
        if (existing) {
          return {
            inventory: state.inventory.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          };
        }
        return { inventory: [...state.inventory, { ...item, quantity: 1 }] };
      });
    },

    useItem: (itemId) => {
      const { inventory, player } = get();
      const item = inventory.find(i => i.id === itemId);
      if (!item || item.quantity <= 0) return;

      set((state) => {
        const updatedInventory = state.inventory
          .map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0);

        let updatedPlayer = { ...state.player };
        if (item.effect) {
          Object.keys(item.effect).forEach(key => {
            updatedPlayer[key] = Math.max(0, Math.min(100, updatedPlayer[key] + item.effect[key]));
          });
        }

        return {
          inventory: updatedInventory,
          player: updatedPlayer
        };
      });
    },

    selectStance: (stance) => {
      set((state) => {
        if (!state.combatState) return {};
        return {
          combatState: {
            ...state.combatState,
            playerStance: stance,
            log: [...state.combatState.log, `Você mudou sua postura de combate para ${stance}.`]
          }
        };
      });
    },

    executeCombatTurn: (playerAction) => {
      const { combatState, player, currentNodeId } = get();
      if (!combatState) return;
      const node = nodes[currentNodeId];
      const enemy = node.enemy;

      let enemyDamage = 0;
      let playerDamage = 0;
      let playerStressDamage = 0;
      let newLog = [];

      // Lógica do jogador baseado na ação e postura
      if (playerAction === 'attack') {
        if (combatState.playerStance === 'Melee') {
          enemyDamage = 15; // Alto dano melee
          newLog.push(`Você ataca ferozmente com a machete causando ${enemyDamage} de dano!`);
        } else if (combatState.playerStance === 'Ranged') {
          if (player.ammo > 0) {
            enemyDamage = 25; // Altíssimo dano ranged
            newLog.push(`Você dispara seu trabucho causando ${enemyDamage} de dano!`);
            set(state => ({ player: { ...state.player, ammo: state.player.ammo - 1 } }));
          } else {
            newLog.push(`Sem munição! Seu ataque falha.`);
          }
        } else {
          enemyDamage = 5; // Dano fraco de arremessar pedras do abrigo
          newLog.push(`Você arremessa detritos do abrigo causando ${enemyDamage} de dano.`);
        }
      } else if (playerAction === 'recover') {
        newLog.push(`Você descansa no abrigo, restaurando 15 de Vida e diminuindo 10 de Stress.`);
        set(state => ({
          player: {
            ...state.player,
            health: Math.min(state.player.maxHealth, state.player.health + 15),
            stress: Math.max(0, state.player.stress - 10)
          }
        }));
      }

      const nextEnemyHealth = Math.max(0, combatState.enemyHealth - enemyDamage);

      if (nextEnemyHealth <= 0) {
        newLog.push(`O ${enemy.name} foi derrotado!`);
        set({
          combatState: {
            ...combatState,
            enemyHealth: 0,
            log: [...combatState.log, ...newLog]
          }
        });
        setTimeout(() => get().changeNode(node.onWinNodeId), 1500);
        return;
      }

      // Turno do inimigo
      if (combatState.playerStance === 'Melee') {
        playerDamage = 12; // Inimigo pune melee
        playerStressDamage = 5;
        newLog.push(`O ${enemy.name} revida com um golpe forte de cano, causando ${playerDamage} de dano.`);
      } else if (combatState.playerStance === 'Ranged') {
        playerDamage = 8;
        playerStressDamage = 8;
        newLog.push(`O ${enemy.name} arremessa pedras e grita ameaças, causando ${playerDamage} de dano e ${playerStressDamage} de stress.`);
      } else {
        // Abrigo protege muito
        playerDamage = 3;
        playerStressDamage = 2;
        newLog.push(`Abrigado nos escombros, você desvia da maioria dos ataques do ${enemy.name}. Sofre apenas ${playerDamage} de dano.`);
      }

      const nextPlayerHealth = Math.max(0, player.health - playerDamage);
      const nextPlayerStress = Math.min(100, player.stress + playerStressDamage);

      set((state) => ({
        player: {
          ...state.player,
          health: nextPlayerHealth,
          stress: nextPlayerStress
        },
        combatState: {
          ...state.combatState,
          enemyHealth: nextEnemyHealth,
          log: [...state.combatState.log, ...newLog]
        }
      }));

      if (nextPlayerHealth <= 0 || nextPlayerStress >= 100) {
        setTimeout(() => get().changeNode(node.onLoseNodeId), 1500);
      }
    }
  }));
  ```

- [ ] **Step 3: Create Vitest Unit Test for useGameStore**
  
  Create: `src/store/useGameStore.test.js`
  ```javascript
  import { describe, it, expect, beforeEach } from 'vitest';
  import { useGameStore } from './useGameStore';

  describe('useGameStore', () => {
    beforeEach(() => {
      // Reinicia o estado global antes de cada teste
      useGameStore.setState({
        player: {
          health: 100,
          maxHealth: 100,
          stress: 0,
          radiation: 0,
          hunger: 20,
          thirst: 20,
          currency: 3,
          scrap: 5,
          ammo: 2
        },
        inventory: [
          { id: "guarana_jesus", name: "Guaraná Jesus", quantity: 1, type: "consumable", effect: { thirst: -30, stress: -20 } }
        ],
        currentNodeId: "inicio_congresso",
        combatState: null
      });
    });

    it('deve inicializar com o nó de introdução', () => {
      const state = useGameStore.getState();
      expect(state.currentNodeId).toBe('inicio_congresso');
    });

    it('deve mudar de nó e aumentar fome/sede', () => {
      useGameStore.getState().changeNode('orelhao_misterioso');
      const state = useGameStore.getState();
      expect(state.currentNodeId).toBe('orelhao_misterioso');
      expect(state.player.thirst).toBe(25);
      expect(state.player.hunger).toBe(23);
    });

    it('deve consumir item de inventário e atualizar atributos', () => {
      useGameStore.getState().useItem('guarana_jesus');
      const state = useGameStore.getState();
      expect(state.inventory.length).toBe(0);
      expect(state.player.thirst).toBe(0);
      expect(state.player.stress).toBe(0);
    });
  });
  ```

- [ ] **Step 4: Install vitest dependency and run test**
  
  Run: `npm install -D vitest`
  Run: `npx vitest run src/store/useGameStore.test.js`
  Expected: All tests pass.

- [ ] **Step 5: Commit**
  
  ```bash
  git add src/data/nodes.js src/store/useGameStore.js src/store/useGameStore.test.js
  git commit -m "feat: implement game nodes, zustand store, and units tests for store actions"
  ```

---

### Task 3: Base Visual Styling (CRT Monitior Overlay)

**Files:**
- Create: `src/styles/crt.css`
- Modify: `src/styles/main.css`
- Create: `src/components/CRTScreen.jsx`

**Interfaces:**
- Consumes: CSS custom variables, React Children
- Produces: CSS CRT overlay container styled dynamically with flickering and retro scanline animations.

- [ ] **Step 1: Write CRT styling layout rules**
  
  Create: `src/styles/crt.css`
  ```css
  .crt-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .crt-monitor {
    position: relative;
    width: 96%;
    height: 94%;
    border: 15px solid #222;
    border-radius: 30px;
    background-color: #0c120c;
    box-shadow: inset 0 0 80px rgba(0, 0, 0, 1), 0 0 40px rgba(51, 255, 51, 0.1);
    overflow: hidden;
    display: grid;
    grid-template-columns: 280px 1fr;
    box-sizing: border-box;
  }

  /* Efeito de Cintilação / Flickering */
  .crt-monitor::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 99;
    background-size: 100% 4px, 6px 100%;
    pointer-events: none;
  }

  .crt-screen-overlay {
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 98;
  }

  /* Scanline Rolando */
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(to bottom, rgba(51, 255, 51, 0) 0%, rgba(51, 255, 51, 0.08) 50%, rgba(51, 255, 51, 0) 100%);
    animation: scanline 8s linear infinite;
    pointer-events: none;
    z-index: 97;
  }
  ```

- [ ] **Step 2: Import crt.css inside main.css**
  
  Modify: `src/styles/main.css`
  ```css
  @import './crt.css';
  ```

- [ ] **Step 3: Create CRTScreen Component**
  
  Create: `src/components/CRTScreen.jsx`
  ```javascript
  import React from 'react';

  export default function CRTScreen({ children }) {
    return (
      <div className="crt-container">
        <div className="crt-monitor">
          <div className="scanline" />
          <div className="crt-screen-overlay" />
          {children}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 4: Update App.jsx to render CRTScreen**
  
  Modify: `src/App.jsx`
  ```javascript
  import React from 'react';
  import CRTScreen from './components/CRTScreen';

  export default function App() {
    return (
      <CRTScreen>
        <div style={{ padding: '20px' }}>Lateral Panel Placeholder</div>
        <div style={{ padding: '20px' }}>Main Area Placeholder</div>
      </CRTScreen>
    );
  }
  ```

- [ ] **Step 5: Verify build compile**
  
  Run: `npm run build`
  Expected: Successful compilation.

- [ ] **Step 6: Commit**
  
  ```bash
  git add src/styles/crt.css src/styles/main.css src/components/CRTScreen.jsx src/App.jsx
  git commit -m "feat: design crt screen container and anim base scanlines"
  ```

---

### Task 4: Character Vitals (Analog Gauges) and Typewriter Dialogue

**Files:**
- Create: `src/components/StatGauge.jsx`
- Create: `src/components/NarrativePanel.jsx`
- Create: `src/styles/components.css`
- Modify: `src/styles/main.css`

**Interfaces:**
- Consumes: `player` stats object from store, active node details.
- Produces: Analog meter components displaying Vitals, and Typewriter dialogue option list.

- [ ] **Step 1: Write CSS variables and rules for visual dashboard elements**
  
  Create: `src/styles/components.css`
  ```css
  /* Sidebar styles */
  .sidebar-panel {
    border-right: 2px solid var(--color-phosphor-green);
    padding: 20px;
    background-color: rgba(10, 15, 10, 0.95);
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    box-sizing: border-box;
  }

  .sidebar-header {
    border-bottom: 2px dashed var(--color-phosphor-green);
    padding-bottom: 10px;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
  }

  /* Gauge styles */
  .gauge-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .gauge-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
  }

  .gauge-bar-outer {
    height: 14px;
    border: 1px solid var(--color-phosphor-green);
    background-color: var(--color-bg-dark);
    position: relative;
  }

  .gauge-bar-inner {
    height: 100%;
    background-color: var(--color-phosphor-green);
    transition: width 0.3s ease-in-out;
  }

  .gauge-bar-inner.radiation {
    background-color: var(--color-orange-rust);
  }

  /* Narrative styles */
  .main-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px;
    height: 100%;
    box-sizing: border-box;
  }

  .dialogue-text {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    white-space: pre-wrap;
  }

  .choices-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .choice-button {
    background-color: transparent;
    color: var(--color-phosphor-green);
    border: 1px solid var(--color-phosphor-green);
    padding: 10px 15px;
    text-align: left;
    font-family: var(--font-terminal);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .choice-button:hover {
    background-color: var(--color-phosphor-green);
    color: var(--color-bg-dark);
  }

  .choice-button:disabled {
    border-color: var(--color-phosphor-green-dim);
    color: var(--color-phosphor-green-dim);
    cursor: not-allowed;
  }
  ```

- [ ] **Step 2: Import components.css inside main.css**
  
  Modify: `src/styles/main.css`
  ```css
  @import './components.css';
  ```

- [ ] **Step 3: Create StatGauge Component**
  
  Create: `src/components/StatGauge.jsx`
  ```javascript
  import React from 'react';

  export default function StatGauge({ label, value, max = 100, isRad = false }) {
    const percentage = Math.max(0, Math.min(100, (value / max) * 100));
    return (
      <div className="gauge-container">
        <div className="gauge-label">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
        <div className="gauge-bar-outer">
          <div 
            className={`gauge-bar-inner ${isRad ? 'radiation' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 4: Create NarrativePanel Component (with typewriter effect)**
  
  Create: `src/components/NarrativePanel.jsx`
  ```javascript
  import React, { useState, useEffect } from 'react';
  import { useGameStore } from '../store/useGameStore';
  import { nodes } from '../data/nodes';

  export default function NarrativePanel() {
    const { currentNodeId, player, changeNode } = useGameStore();
    const node = nodes[currentNodeId];
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      setDisplayedText('');
      if (!node || node.type !== 'narrative') return;

      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + node.text.charAt(index));
        index++;
        if (index >= node.text.length) {
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }, [currentNodeId]);

    if (!node || node.type !== 'narrative') return null;

    const checkRequirement = (req) => {
      if (!req) return true;
      if (req.currency && player.currency < req.currency) return false;
      return true;
    };

    return (
      <div className="main-panel">
        <div className="dialogue-text">{displayedText}</div>
        <div className="choices-list">
          {node.choices.map((choice, i) => {
            const allowed = checkRequirement(choice.requirements);
            return (
              <button
                key={i}
                className="choice-button"
                disabled={!allowed}
                onClick={() => {
                  if (choice.effects) {
                    if (choice.effects.currency) {
                      useGameStore.getState().modifyPlayerStat('currency', choice.effects.currency);
                    }
                    if (choice.effects.stress) {
                      useGameStore.getState().modifyPlayerStat('stress', choice.effects.stress);
                    }
                    if (choice.effects.scrap) {
                      useGameStore.getState().modifyPlayerStat('scrap', choice.effects.scrap);
                    }
                    if (choice.effects.thirst) {
                      useGameStore.getState().modifyPlayerStat('thirst', choice.effects.thirst);
                    }
                    if (choice.effects.hasMachete) {
                      useGameStore.getState().addItemToInventory({ id: "machete", name: "Machete Enferrujada", quantity: 1, type: "weapon" });
                    }
                    if (choice.effects.hasGuarana) {
                      useGameStore.getState().addItemToInventory({ id: "guarana_jesus", name: "Guaraná Jesus", quantity: 1, type: "consumable", effect: { thirst: -30, stress: -20 } });
                    }
                  }
                  changeNode(choice.nextNodeId);
                }}
              >
                {choice.text} {!allowed ? ' (Fichas insuficientes)' : ''}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 5: Verify build compile**
  
  Run: `npm run build`
  Expected: Successful compile.

- [ ] **Step 6: Commit**
  
  ```bash
  git add src/components/StatGauge.jsx src/components/NarrativePanel.jsx src/styles/components.css src/styles/main.css
  git commit -m "feat: design statgauges and narrative dialogue components"
  ```

---

### Task 5: Inventory and Sidebar Layout

**Files:**
- Create: `src/components/InventoryGrid.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `inventory` list from store, useItem callback.
- Produces: Sidebar sidebar component and clickable grid list.

- [ ] **Step 1: Create InventoryGrid Component**
  
  Create: `src/components/InventoryGrid.jsx`
  ```javascript
  import React from 'react';
  import { useGameStore } from '../store/useGameStore';

  export default function InventoryGrid() {
    const { inventory, useItem } = useGameStore();

    return (
      <div className="inventory-container" style={{ marginTop: '20px', borderTop: '1px solid var(--color-phosphor-green)', paddingTop: '10px' }}>
        <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>Inventário</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {inventory.map((item, idx) => (
            <div 
              key={idx} 
              style={{
                border: '1px solid var(--color-phosphor-green)',
                padding: '5px',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(51, 255, 51, 0.05)'
              }}
            >
              <span>{item.name} x{item.quantity}</span>
              {item.type === 'consumable' && (
                <button 
                  onClick={() => useItem(item.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-phosphor-green)',
                    color: 'var(--color-phosphor-green)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    marginTop: '5px',
                    padding: '2px 5px'
                  }}
                >
                  Usar
                </button>
              )}
            </div>
          ))}
          {inventory.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--color-phosphor-green-dim)' }}>Vazio</span>}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Update App.jsx to render sidebar panels and main area**
  
  Modify: `src/App.jsx`
  ```javascript
  import React from 'react';
  import CRTScreen from './components/CRTScreen';
  import StatGauge from './components/StatGauge';
  import NarrativePanel from './components/NarrativePanel';
  import InventoryGrid from './components/InventoryGrid';
  import { useGameStore } from './store/useGameStore';
  import { nodes } from './data/nodes';

  export default function App() {
    const { player, currentNodeId } = useGameStore();
    const node = nodes[currentNodeId];

    return (
      <CRTScreen>
        {/* Painel Lateral Esquerdo */}
        <div className="sidebar-panel">
          <div className="sidebar-header">
            Wasteland Operator
          </div>
          
          <StatGauge label="Vida (HP)" value={player.health} max={player.maxHealth} />
          <StatGauge label="Stress" value={player.stress} max={100} />
          <StatGauge label="Radiação" value={player.radiation} max={100} isRad={true} />

          <div style={{ marginTop: '10px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>Fome: {player.hunger}%</div>
            <div>Sede: {player.thirst}%</div>
            <div>Fichas: {player.currency}</div>
            <div>Sucata: {player.scrap}</div>
            <div>Munição: {player.ammo}</div>
          </div>

          <InventoryGrid />
        </div>

        {/* Área Principal (Diálogos ou Combates) */}
        <div className="main-content-area" style={{ height: '100%' }}>
          {node && node.type === 'narrative' && <NarrativePanel />}
        </div>
      </CRTScreen>
    );
  }
  ```

- [ ] **Step 3: Compile verify**
  
  Run: `npm run build`
  Expected: Success compile.

- [ ] **Step 4: Commit**
  
  ```bash
  git add src/components/InventoryGrid.jsx src/App.jsx
  git commit -m "feat: implement side panels and inventory integration"
  ```

---

### Task 6: Combat Interface (Stance-based Turn-based Combat Panel)

**Files:**
- Create: `src/components/CombatPanel.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `combatState` state, `currentNodeId`, combat actions from store.
- Produces: Full screen combat interface displaying log history, enemy details, stance selection, and action actions.

- [ ] **Step 1: Create CombatPanel Component**
  
  Create: `src/components/CombatPanel.jsx`
  ```javascript
  import React from 'react';
  import { useGameStore } from '../store/useGameStore';
  import { nodes } from '../data/nodes';

  export default function CombatPanel() {
    const { currentNodeId, combatState, selectStance, executeCombatTurn } = useGameStore();
    const node = nodes[currentNodeId];
    if (!node || node.type !== 'combat' || !combatState) return null;

    const enemy = node.enemy;

    return (
      <div className="main-panel" style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '20px', height: '100%', padding: '30px' }}>
        
        {/* Informações do Inimigo */}
        <div style={{ borderBottom: '1px solid var(--color-phosphor-green)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0', textTransform: 'uppercase' }}>Combate: {enemy.name}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-orange-rust)' }}>Distância Original: {enemy.position}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Vida Inimiga: {combatState.enemyHealth} / {enemy.health}</div>
            <div style={{ width: '150px', height: '10px', border: '1px solid var(--color-phosphor-green)', backgroundColor: 'var(--color-bg-dark)' }}>
              <div style={{ width: `${(combatState.enemyHealth / enemy.health) * 100}%`, height: '100%', backgroundColor: 'var(--color-phosphor-green)' }} />
            </div>
          </div>
        </div>

        {/* Histórico do Log de Combate */}
        <div style={{ border: '1px solid var(--color-phosphor-green)', padding: '15px', overflowY: 'auto', backgroundColor: 'rgba(51, 255, 51, 0.02)', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.9rem' }}>
          {combatState.log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {/* Ações e Postura do Jogador */}
        <div style={{ borderTop: '1px solid var(--color-phosphor-green)', paddingTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Posturas (Stances) */}
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Selecionar Postura</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Cover', 'Melee', 'Ranged'].map((stance) => (
                <button
                  key={stance}
                  onClick={() => selectStance(stance)}
                  style={{
                    flex: 1,
                    backgroundColor: combatState.playerStance === stance ? 'var(--color-phosphor-green)' : 'transparent',
                    color: combatState.playerStance === stance ? 'var(--color-bg-dark)' : 'var(--color-phosphor-green)',
                    border: '1px solid var(--color-phosphor-green)',
                    cursor: 'pointer',
                    padding: '8px',
                    fontFamily: var(--font-terminal),
                    textTransform: 'uppercase'
                  }}
                >
                  {stance}
                </button>
              ))}
            </div>
          </div>

          {/* Ataque ou Ação */}
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Ações</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => executeCombatTurn('attack')}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: 'var(--color-phosphor-green)',
                  border: '1px solid var(--color-phosphor-green)',
                  cursor: 'pointer',
                  padding: '8px',
                  fontFamily: var(--font-terminal),
                  textTransform: 'uppercase'
                }}
              >
                Atacar
              </button>
              <button
                onClick={() => executeCombatTurn('recover')}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: 'var(--color-phosphor-green)',
                  border: '1px solid var(--color-phosphor-green)',
                  cursor: 'pointer',
                  padding: '8px',
                  fontFamily: var(--font-terminal),
                  textTransform: 'uppercase'
                }}
              >
                Descansar
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }
  ```

- [ ] **Step 2: Update App.jsx to render CombatPanel conditionally**
  
  Modify: `src/App.jsx`
  ```javascript
  import React from 'react';
  import CRTScreen from './components/CRTScreen';
  import StatGauge from './components/StatGauge';
  import NarrativePanel from './components/NarrativePanel';
  import CombatPanel from './components/CombatPanel';
  import InventoryGrid from './components/InventoryGrid';
  import { useGameStore } from './store/useGameStore';
  import { nodes } from './data/nodes';

  export default function App() {
    const { player, currentNodeId } = useGameStore();
    const node = nodes[currentNodeId];

    return (
      <CRTScreen>
        {/* Painel Lateral Esquerdo */}
        <div className="sidebar-panel">
          <div className="sidebar-header">
            Wasteland Operator
          </div>
          
          <StatGauge label="Vida (HP)" value={player.health} max={player.maxHealth} />
          <StatGauge label="Stress" value={player.stress} max={100} />
          <StatGauge label="Radiação" value={player.radiation} max={100} isRad={true} />

          <div style={{ marginTop: '10px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>Fome: {player.hunger}%</div>
            <div>Sede: {player.thirst}%</div>
            <div>Fichas: {player.currency}</div>
            <div>Sucata: {player.scrap}</div>
            <div>Munição: {player.ammo}</div>
          </div>

          <InventoryGrid />
        </div>

        {/* Área Principal (Diálogos ou Combates) */}
        <div className="main-content-area" style={{ height: '100%' }}>
          {node && node.type === 'narrative' && <NarrativePanel />}
          {node && node.type === 'combat' && <CombatPanel />}
        </div>
      </CRTScreen>
    );
  }
  ```

- [ ] **Step 3: Fix syntax error in button template strings if any**
  
  Note: Make sure `var(--font-terminal)` is wrapped in quotes or correctly format font family values in `CombatPanel.jsx` style attributes: `fontFamily: 'var(--font-terminal)'`. Let's ensure this is fixed.

- [ ] **Step 4: Verify build compile**
  
  Run: `npm run build`
  Expected: Successful compilation.

- [ ] **Step 5: Commit**
  
  ```bash
  git add src/components/CombatPanel.jsx src/App.jsx
  git commit -m "feat: implement turn-based stance-based combat view panel"
  ```

---

### Task 7: End-to-End MVP Integration and Git Sync

**Files:**
- Modify: `src/App.jsx`
- Create: `README.md`

**Interfaces:**
- Consumes: Complete built application.
- Produces: Production build, deployed code, and remote sync on GitHub.

- [ ] **Step 1: Add HTML/CSS reset styling or template defaults if needed in index.html**
  
  Verify the canvas viewport, title tag, and clean page title to match post-apocalyptic settings.
  Modify `index.html` title tag to "Fallout de Pobre V2".

- [ ] **Step 2: Build production distribution bundle**
  
  Run: `npm run build`
  Expected: Production bundle is output to `dist/` directory cleanly.

- [ ] **Step 3: Create README.md**
  
  Create: `README.md`
  ```markdown
  # Fallout de Pobre V2

  Um jogo RPG de sobrevivência retrofuturista tropical desenvolvido em React, Zustand e CSS Vanilla.

  ## Como Rodar Localmente
  1. Instalar dependências:
     ```bash
     npm install
     ```
  2. Iniciar servidor de desenvolvimento:
     ```bash
     npm run dev
     ```
  3. Executar testes de unidade:
     ```bash
     npm run test
     ```
  ```

- [ ] **Step 4: Push all files to Github**
  
  Run: `git add .`
  Run: `git commit -m "feat: complete fallout de pobre v2 mvp release prototype"`
  Run: `git push -u origin master`
  Expected: Remote repository correctly updated.
