import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './useGameStore';

const resetState = () => {
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
      ammo: 2,
    },
    inventory: [
      {
        id: 'guarana_jesus',
        name: 'Guaraná Jesus',
        quantity: 1,
        type: 'consumable',
        effect: { thirst: -30, stress: -20 },
      },
    ],
    flags: {
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
      conheceuDonaLinha: false,
      trocouSucataLinha: false,
      ouviuFofocaNilo: false,
      conheceuIrmaOcupada: false,
      falouComTom: false,
      tomOfendido: false,
      ouviuFitaNiloExtra: false,
      conheceuGuto: false,
    },
    introComplete: true,
    currentNodeId: 'inicio_congresso',
    combatState: null,
  });
};

describe('useGameStore', () => {
  beforeEach(() => {
    resetState();
  });

  it('deve inicializar com o nó de introdução', () => {
    const state = useGameStore.getState();
    expect(state.currentNodeId).toBe('inicio_congresso');
  });

  it('completeIntro deve marcar a intro CRT como concluída', () => {
    useGameStore.setState({ introComplete: false });
    expect(useGameStore.getState().introComplete).toBe(false);
    useGameStore.getState().completeIntro();
    expect(useGameStore.getState().introComplete).toBe(true);
  });

  it('deve mudar de nó e aumentar fome/sede levemente', () => {
    useGameStore.getState().changeNode('caminho_orelhao');
    const state = useGameStore.getState();
    expect(state.currentNodeId).toBe('caminho_orelhao');
    expect(state.player.thirst).toBe(22);
    expect(state.player.hunger).toBe(21);
  });

  it('deve consumir item de inventário e atualizar atributos', () => {
    useGameStore.getState().useItem('guarana_jesus');
    const state = useGameStore.getState();
    expect(state.inventory.length).toBe(0);
    expect(state.player.thirst).toBe(0);
    expect(state.player.stress).toBe(0);
  });

  it('deve limitar atributos corretamente no modifyPlayerStat', () => {
    useGameStore.getState().modifyPlayerStat('health', 50);
    expect(useGameStore.getState().player.health).toBe(100);

    useGameStore.getState().modifyPlayerStat('stress', 120);
    expect(useGameStore.getState().player.stress).toBe(100);

    useGameStore.getState().modifyPlayerStat('scrap', 150);
    expect(useGameStore.getState().player.scrap).toBe(155);

    useGameStore.getState().modifyPlayerStat('currency', 110);
    expect(useGameStore.getState().player.currency).toBe(113);
  });

  it('choose deve aplicar efeitos, flags e itens', () => {
    const ok = useGameStore.getState().choose({
      text: 'test',
      nextNodeId: 'olhar_arredor',
      effects: {
        currency: -1,
        flags: { ouviuNilo: true },
        addItems: ['machete'],
      },
    });
    expect(ok).toBe(true);
    const state = useGameStore.getState();
    expect(state.currentNodeId).toBe('olhar_arredor');
    expect(state.player.currency).toBe(2);
    expect(state.flags.ouviuNilo).toBe(true);
    expect(state.inventory.some((i) => i.id === 'machete')).toBe(true);
  });

  it('choose deve falhar se requisitos não forem atendidos', () => {
    const ok = useGameStore.getState().choose({
      text: 'pagar 99',
      nextNodeId: 'pedagio_pago',
      requirements: { currency: 99 },
      effects: { currency: -99 },
    });
    expect(ok).toBe(false);
    expect(useGameStore.getState().currentNodeId).toBe('inicio_congresso');
    expect(useGameStore.getState().player.currency).toBe(3);
  });

  it('meetsRequirements deve validar item e flag', () => {
    expect(useGameStore.getState().meetsRequirements({ item: 'guarana_jesus' })).toBe(
      true
    );
    expect(useGameStore.getState().meetsRequirements({ item: 'machete' })).toBe(false);
    expect(useGameStore.getState().meetsRequirements({ flag: 'ouviuNilo' })).toBe(false);
    useGameStore.getState().setFlag('ouviuNilo', true);
    expect(useGameStore.getState().meetsRequirements({ flag: 'ouviuNilo' })).toBe(true);
  });

  it('deve permitir mudar de postura (selectStance)', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Melee');
    const state = useGameStore.getState();
    expect(state.combatState.playerStance).toBe('Melee');
    expect(state.combatState.log[state.combatState.log.length - 1]).toContain(
      'Você mudou sua postura de combate para Melee.'
    );
  });

  it('deve executar turno de combate com ataque na postura Cover', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    expect(state.combatState.enemyHealth).toBe(35);
    expect(state.player.health).toBe(97);
    expect(state.player.stress).toBe(2);
  });

  it('deve executar turno de combate com ataque na postura Melee', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Melee');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    expect(state.combatState.enemyHealth).toBe(25);
    expect(state.player.health).toBe(88);
    expect(state.player.stress).toBe(5);
  });

  it('deve consumir munição ao atacar na postura Ranged e causar dano alto', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Ranged');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    expect(state.player.ammo).toBe(1);
    expect(state.combatState.enemyHealth).toBe(15);
    expect(state.player.health).toBe(92);
    expect(state.player.stress).toBe(8);
  });

  it('não deve causar dano se não houver munição na postura Ranged', () => {
    useGameStore.setState({
      player: {
        ...useGameStore.getState().player,
        ammo: 0,
      },
    });
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.getState().selectStance('Ranged');
    useGameStore.getState().executeCombatTurn('attack');
    const state = useGameStore.getState();
    expect(state.player.ammo).toBe(0);
    expect(state.combatState.enemyHealth).toBe(40);
    expect(state.player.health).toBe(92);
    expect(state.player.stress).toBe(8);
  });

  it('deve restaurar vida e reduzir estresse ao usar ação de recover', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.setState({
      player: {
        ...useGameStore.getState().player,
        health: 50,
        stress: 50,
      },
    });
    useGameStore.getState().executeCombatTurn('recover');
    const state = useGameStore.getState();
    expect(state.player.health).toBe(62);
    expect(state.player.stress).toBe(42);
  });

  it('deve ignorar novos turnos se o inimigo já estiver derrotado', () => {
    useGameStore.getState().changeNode('combate_milicia');
    useGameStore.setState({
      combatState: {
        ...useGameStore.getState().combatState,
        enemyHealth: 0,
      },
    });
    const stateBefore = { ...useGameStore.getState().combatState };
    useGameStore.getState().executeCombatTurn('attack');
    const stateAfter = useGameStore.getState().combatState;
    expect(stateAfter.enemyHealth).toBe(0);
    expect(stateAfter.log.length).toBe(stateBefore.log.length);
  });
});
