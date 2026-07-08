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
