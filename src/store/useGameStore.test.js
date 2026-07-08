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
