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
    set((state) => {
      let cap;
      if (stat === 'health') {
        cap = state.player.maxHealth || 100;
      } else if (['stress', 'radiation', 'hunger', 'thirst'].includes(stat)) {
        cap = 100;
      }
      
      const newValue = state.player[stat] + val;
      const cappedValue = cap !== undefined ? Math.min(cap, newValue) : newValue;
      
      return {
        player: {
          ...state.player,
          [stat]: Math.max(0, cappedValue)
        }
      };
    });
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
    const { inventory } = get();
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) return;

    set((state) => {
      const updatedInventory = state.inventory
        .map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0);

      let updatedPlayer = { ...state.player };
      if (item.effect) {
        Object.keys(item.effect).forEach(key => {
          const cap = key === 'health' ? (state.player.maxHealth || 100) : 100;
          updatedPlayer[key] = Math.max(0, Math.min(cap, updatedPlayer[key] + item.effect[key]));
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

    // Gating check to prevent multiple combat turns during node transition or after fight ends
    if (combatState.enemyHealth <= 0 || player.health <= 0 || player.stress >= 100) {
      return;
    }

    const node = nodes[currentNodeId];
    const enemy = node.enemy;

    let enemyDamage = 0;
    let playerDamage = 0;
    let playerStressDamage = 0;
    let nextAmmo = player.ammo;
    let nextPlayerHealth = player.health;
    let nextPlayerStress = player.stress;
    let nextEnemyHealth = combatState.enemyHealth;
    let newLog = [];

    // Player action logic
    if (playerAction === 'attack') {
      if (combatState.playerStance === 'Melee') {
        enemyDamage = 15;
        newLog.push(`Você ataca ferozmente com a machete causando ${enemyDamage} de dano!`);
      } else if (combatState.playerStance === 'Ranged') {
        if (nextAmmo > 0) {
          enemyDamage = 25;
          newLog.push(`Você dispara seu trabucho causando ${enemyDamage} de dano!`);
          nextAmmo = nextAmmo - 1;
        } else {
          newLog.push(`Sem munição! Seu ataque falha.`);
        }
      } else {
        enemyDamage = 5;
        newLog.push(`Você arremessa detritos do abrigo causando ${enemyDamage} de dano.`);
      }
    } else if (playerAction === 'recover') {
      newLog.push(`Você descansa no abrigo, restaurando 15 de Vida e diminuindo 10 de Stress.`);
      nextPlayerHealth = Math.min(player.maxHealth || 100, nextPlayerHealth + 15);
      nextPlayerStress = Math.max(0, nextPlayerStress - 10);
    }

    nextEnemyHealth = Math.max(0, nextEnemyHealth - enemyDamage);

    if (nextEnemyHealth <= 0) {
      newLog.push(`O ${enemy.name} foi derrotado!`);
      set((state) => ({
        player: {
          ...state.player,
          ammo: nextAmmo,
          health: nextPlayerHealth,
          stress: nextPlayerStress
        },
        combatState: {
          ...state.combatState,
          enemyHealth: 0,
          log: [...state.combatState.log, ...newLog]
        }
      }));
      setTimeout(() => get().changeNode(node.onWinNodeId), 1500);
      return;
    }

    // Enemy turn
    if (combatState.playerStance === 'Melee') {
      playerDamage = 12;
      playerStressDamage = 5;
      newLog.push(`O ${enemy.name} revida com um golpe forte de cano, causando ${playerDamage} de dano.`);
    } else if (combatState.playerStance === 'Ranged') {
      playerDamage = 8;
      playerStressDamage = 8;
      newLog.push(`O ${enemy.name} arremessa pedras e grita ameaças, causando ${playerDamage} de dano e ${playerStressDamage} de stress.`);
    } else {
      playerDamage = 3;
      playerStressDamage = 2;
      newLog.push(`Abrigado nos escombros, você desvia da maioria dos ataques do ${enemy.name}. Sofre apenas ${playerDamage} de dano.`);
    }

    nextPlayerHealth = Math.max(0, nextPlayerHealth - playerDamage);
    nextPlayerStress = Math.min(100, nextPlayerStress + playerStressDamage);

    set((state) => ({
      player: {
        ...state.player,
        ammo: nextAmmo,
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
