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

  it('deve limitar atributos corretamente no modifyPlayerStat', () => {
    // Health caps at maxHealth (100)
    useGameStore.getState().modifyPlayerStat('health', 50);
    expect(useGameStore.getState().player.health).toBe(100);

    // Stress caps at 100
    useGameStore.getState().modifyPlayerStat('stress', 120);
    expect(useGameStore.getState().player.stress).toBe(100);

    // Scrap can exceed 100
    useGameStore.getState().modifyPlayerStat('scrap', 150);
    expect(useGameStore.getState().player.scrap).toBe(155);

    // Currency can exceed 100
    useGameStore.getState().modifyPlayerStat('currency', 110);
    expect(useGameStore.getState().player.currency).toBe(113);
  });

  it('deve permitir mudar de postura (selectStance)', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Melee');
    const state = useGameStore.getState();
    expect(state.combatState.playerStance).toBe('Melee');
    expect(state.combatState.log[state.combatState.log.length - 1]).toContain('Você mudou sua postura de combate para Melee.');
  });

  it('deve executar turno de combate com ataque na postura Cover', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    // Enemy: 40 - 5 = 35
    expect(state.combatState.enemyHealth).toBe(35);
    // Player: 100 - 3 = 97
    expect(state.player.health).toBe(97);
    // Stress: 0 + 2 = 2
    expect(state.player.stress).toBe(2);
  });

  it('deve executar turno de combate com ataque na postura Melee', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Melee');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    // Enemy: 40 - 15 = 25
    expect(state.combatState.enemyHealth).toBe(25);
    // Player: 100 - 12 = 88
    expect(state.player.health).toBe(88);
    // Stress: 0 + 5 = 5
    expect(state.player.stress).toBe(5);
  });

  it('deve consumir munição ao atacar na postura Ranged e causar dano alto', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Ranged');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    // Ammo: 2 - 1 = 1
    expect(state.player.ammo).toBe(1);
    // Enemy: 40 - 25 = 15
    expect(state.combatState.enemyHealth).toBe(15);
    // Player: 100 - 8 = 92
    expect(state.player.health).toBe(92);
    // Stress: 0 + 8 = 8
    expect(state.player.stress).toBe(8);
  });

  it('não deve causar dano se não houver munição na postura Ranged', () => {
    // Set ammo to 0
    useGameStore.setState({
      player: {
        ...useGameStore.getState().player,
        ammo: 0
      }
    });
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Ranged');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    expect(state.player.ammo).toBe(0);
    // Enemy should not take damage: 40 - 0 = 40
    expect(state.combatState.enemyHealth).toBe(40);
    // Player: 100 - 8 = 92
    expect(state.player.health).toBe(92);
    // Stress: 0 + 8 = 8
    expect(state.player.stress).toBe(8);
  });

  it('deve restaurar vida e reduzir estresse ao usar ação de recover', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.setState({
      player: {
        ...useGameStore.getState().player,
        health: 50,
        stress: 50
      }
    });
    useGameStore.getState().executeCombatTurn('recover');
    const state = useGameStore.getState();
    // Recover player health: 50 + 15 = 65, then enemy attacks Cover stance -3 -> 62
    expect(state.player.health).toBe(62);
    // Recover player stress: 50 - 10 = 40, then enemy attacks Cover stance +2 -> 42
    expect(state.player.stress).toBe(42);
  });

  it('deve ignorar novos turnos se o inimigo já estiver derrotado', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.setState({
      combatState: {
        ...useGameStore.getState().combatState,
        enemyHealth: 0
      }
    });
    const stateBefore = { ...useGameStore.getState().combatState };
    useGameStore.getState().executeCombatTurn('attack');
    const stateAfter = useGameStore.getState().combatState;
    expect(stateAfter.enemyHealth).toBe(0);
    expect(stateAfter.log.length).toBe(stateBefore.log.length);
  });
});
