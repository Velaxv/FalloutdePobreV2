import { create } from 'zustand';
import { nodes } from '../data/nodes';
import { ITEMS } from '../data/items';

const STAT_CAPS = {
  health: (player) => player.maxHealth || 100,
  stress: 100,
  radiation: 100,
  hunger: 100,
  thirst: 100,
};

const initialPlayer = {
  health: 100,
  maxHealth: 100,
  stress: 0,
  radiation: 0,
  hunger: 20,
  thirst: 20,
  currency: 3,
  scrap: 5,
  ammo: 2,
};

const initialFlags = {
  ouviuNilo: false,
  achouCorpoNilo: false,
  temMachete: false,
  saqueouEscombros: false,
  saqueouOpala: false,
  roubouOferenda: false,
  ouviuEcoMalha: false,
  pagouPedagio: false,
  barganhouPedagio: false,
  derrotouCapanga: false,
  passouPedagio: false,
  reativouOrelhaoEsplanada: false,
  // NPCs
  conheceuDonaLinha: false,
  trocouSucataLinha: false,
  ouviuFofocaNilo: false,
  conheceuIrmaOcupada: false,
  falouComTom: false,
  tomOfendido: false,
  ouviuFitaNiloExtra: false,
  conheceuGuto: false,
};

function clampStat(stat, value, player) {
  const cap = STAT_CAPS[stat];
  const max = typeof cap === 'function' ? cap(player) : cap;
  const floored = Math.max(0, value);
  return max !== undefined ? Math.min(max, floored) : floored;
}

function hasItem(inventory, itemId) {
  return inventory.some((i) => i.id === itemId && i.quantity > 0);
}

export const useGameStore = create((set, get) => ({
  player: { ...initialPlayer },
  inventory: [],
  flags: { ...initialFlags },
  introComplete: false,
  currentNodeId: 'inicio_congresso',
  combatState: null,

  completeIntro: () => set({ introComplete: true }),

  meetsRequirements: (req) => {
    if (!req) return true;
    const { player, inventory, flags } = get();

    if (req.currency != null && player.currency < req.currency) return false;
    if (req.scrap != null && player.scrap < req.scrap) return false;
    if (req.ammo != null && player.ammo < req.ammo) return false;
    if (req.health != null && player.health < req.health) return false;
    if (req.item && !hasItem(inventory, req.item)) return false;
    if (req.flag && !flags[req.flag]) return false;
    if (req.notFlag && flags[req.notFlag]) return false;

    return true;
  },

  modifyPlayerStat: (stat, val) => {
    set((state) => {
      const newValue = (state.player[stat] ?? 0) + val;
      return {
        player: {
          ...state.player,
          [stat]: clampStat(stat, newValue, state.player),
        },
      };
    });
  },

  setFlag: (key, value = true) => {
    set((state) => ({
      flags: { ...state.flags, [key]: value },
    }));
  },

  addItemToInventory: (item) => {
    const template = typeof item === 'string' ? ITEMS[item] : item;
    if (!template) return;

    set((state) => {
      const existing = state.inventory.find((i) => i.id === template.id);
      if (existing) {
        return {
          inventory: state.inventory.map((i) =>
            i.id === template.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        inventory: [...state.inventory, { ...template, quantity: template.quantity ?? 1 }],
      };
    });
  },

  removeItemFromInventory: (itemId) => {
    set((state) => {
      const existing = state.inventory.find((i) => i.id === itemId);
      if (!existing) return {};

      if (existing.quantity <= 1) {
        return {
          inventory: state.inventory.filter((i) => i.id !== itemId),
        };
      }
      return {
        inventory: state.inventory.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },

  useItem: (itemId) => {
    const { inventory } = get();
    const item = inventory.find((i) => i.id === itemId);
    if (!item || item.quantity <= 0 || item.type !== 'consumable') return;

    set((state) => {
      const updatedInventory = state.inventory
        .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);

      let updatedPlayer = { ...state.player };
      if (item.effect) {
        Object.keys(item.effect).forEach((key) => {
          updatedPlayer[key] = clampStat(
            key,
            (updatedPlayer[key] ?? 0) + item.effect[key],
            updatedPlayer
          );
        });
      }

      return {
        inventory: updatedInventory,
        player: updatedPlayer,
      };
    });
  },

  changeNode: (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return;

    let combatState = null;
    if (node.type === 'combat') {
      combatState = {
        enemyHealth: node.enemy.health,
        playerStance: 'Cover',
        log: [
          `Combate iniciado contra ${node.enemy.name}! Você está em postura de Abrigo.`,
        ],
      };
    }

    set((state) => {
      // Tick leve de sobrevivência (grafo do Ato 1 é longo)
      const nextThirst = clampStat('thirst', state.player.thirst + 2, state.player);
      const nextHunger = clampStat('hunger', state.player.hunger + 1, state.player);

      return {
        currentNodeId: nodeId,
        combatState: node.type === 'combat' ? combatState : null,
        player: {
          ...state.player,
          thirst: nextThirst,
          hunger: nextHunger,
        },
      };
    });
  },

  /**
   * Aplica efeitos de uma escolha narrativa e navega para o próximo nó.
   * effects: { currency, stress, ..., flags: {}, addItems: [], removeItem: 'id' }
   */
  choose: (choice) => {
    if (!choice?.nextNodeId) return false;
    if (!get().meetsRequirements(choice.requirements)) return false;

    const effects = choice.effects || {};
    const playerStats = [
      'health',
      'stress',
      'radiation',
      'hunger',
      'thirst',
      'currency',
      'scrap',
      'ammo',
    ];

    set((state) => {
      let player = { ...state.player };
      let inventory = [...state.inventory];
      let flags = { ...state.flags };

      playerStats.forEach((stat) => {
        if (effects[stat] != null) {
          player[stat] = clampStat(stat, player[stat] + effects[stat], player);
        }
      });

      if (effects.flags) {
        flags = { ...flags, ...effects.flags };
      }

      if (effects.addItems?.length) {
        effects.addItems.forEach((itemRef) => {
          const template = typeof itemRef === 'string' ? ITEMS[itemRef] : itemRef;
          if (!template) return;
          const existing = inventory.find((i) => i.id === template.id);
          if (existing) {
            inventory = inventory.map((i) =>
              i.id === template.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            inventory = [...inventory, { ...template, quantity: 1 }];
          }
        });
      }

      // Legado / atalhos booleanos de item
      if (effects.hasMachete) {
        const template = ITEMS.machete;
        if (!inventory.some((i) => i.id === 'machete')) {
          inventory = [...inventory, { ...template, quantity: 1 }];
        }
        flags.temMachete = true;
      }
      if (effects.hasGuarana) {
        const template = ITEMS.guarana_jesus;
        const existing = inventory.find((i) => i.id === 'guarana_jesus');
        if (existing) {
          inventory = inventory.map((i) =>
            i.id === 'guarana_jesus' ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          inventory = [...inventory, { ...template, quantity: 1 }];
        }
      }

      if (effects.removeItem) {
        const id = effects.removeItem;
        const existing = inventory.find((i) => i.id === id);
        if (existing) {
          if (existing.quantity <= 1) {
            inventory = inventory.filter((i) => i.id !== id);
          } else {
            inventory = inventory.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            );
          }
        }
      }

      return { player, inventory, flags };
    });

    get().changeNode(choice.nextNodeId);
    return true;
  },

  selectStance: (stance) => {
    set((state) => {
      if (!state.combatState) return {};
      return {
        combatState: {
          ...state.combatState,
          playerStance: stance,
          log: [
            ...state.combatState.log,
            `Você mudou sua postura de combate para ${stance}.`,
          ],
        },
      };
    });
  },

  executeCombatTurn: (playerAction) => {
    const { combatState, player, currentNodeId } = get();
    if (!combatState) return;

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

    if (playerAction === 'attack') {
      if (combatState.playerStance === 'Melee') {
        enemyDamage = 15;
        newLog.push(
          `Você ataca ferozmente com a machete causando ${enemyDamage} de dano!`
        );
      } else if (combatState.playerStance === 'Ranged') {
        if (nextAmmo > 0) {
          enemyDamage = 25;
          newLog.push(
            `Você dispara seu trabucho causando ${enemyDamage} de dano!`
          );
          nextAmmo = nextAmmo - 1;
        } else {
          newLog.push('Sem munição! Seu ataque falha.');
        }
      } else {
        enemyDamage = 5;
        newLog.push(
          `Você arremessa detritos do abrigo causando ${enemyDamage} de dano.`
        );
      }
    } else if (playerAction === 'recover') {
      newLog.push(
        'Você descansa no abrigo, restaurando 15 de Vida e diminuindo 10 de Stress.'
      );
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
          stress: nextPlayerStress,
        },
        combatState: {
          ...state.combatState,
          enemyHealth: 0,
          log: [...state.combatState.log, ...newLog],
        },
      }));
      setTimeout(() => get().changeNode(node.onWinNodeId), 1500);
      return;
    }

    if (combatState.playerStance === 'Melee') {
      playerDamage = 12;
      playerStressDamage = 5;
      newLog.push(
        `O ${enemy.name} revida com um golpe forte de cano, causando ${playerDamage} de dano.`
      );
    } else if (combatState.playerStance === 'Ranged') {
      playerDamage = 8;
      playerStressDamage = 8;
      newLog.push(
        `O ${enemy.name} arremessa pedras e grita ameaças, causando ${playerDamage} de dano e ${playerStressDamage} de stress.`
      );
    } else {
      playerDamage = 3;
      playerStressDamage = 2;
      newLog.push(
        `Abrigado nos escombros, você desvia da maioria dos ataques do ${enemy.name}. Sofre apenas ${playerDamage} de dano.`
      );
    }

    nextPlayerHealth = Math.max(0, nextPlayerHealth - playerDamage);
    nextPlayerStress = Math.min(100, nextPlayerStress + playerStressDamage);

    set((state) => ({
      player: {
        ...state.player,
        ammo: nextAmmo,
        health: nextPlayerHealth,
        stress: nextPlayerStress,
      },
      combatState: {
        ...state.combatState,
        enemyHealth: nextEnemyHealth,
        log: [...state.combatState.log, ...newLog],
      },
    }));

    if (nextPlayerHealth <= 0 || nextPlayerStress >= 100) {
      setTimeout(() => get().changeNode(node.onLoseNodeId), 1500);
    }
  },
}));
