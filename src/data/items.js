/** Catálogo de itens referenciáveis por id nos nós narrativos */
export const ITEMS = {
  guarana_jesus: {
    id: 'guarana_jesus',
    name: 'Guaraná Jesus',
    type: 'consumable',
    effect: { thirst: -30, stress: -20 },
  },
  machete: {
    id: 'machete',
    name: 'Machete Enferrujada',
    type: 'weapon',
  },
  fita_nilo: {
    id: 'fita_nilo',
    name: 'Fita K7 — Nilo',
    type: 'lore',
  },
  charque_seco: {
    id: 'charque_seco',
    name: 'Charque Seco',
    type: 'consumable',
    effect: { hunger: -25, thirst: 5 },
  },
  agua_garrafa: {
    id: 'agua_garrafa',
    name: 'Água de Garrafa (duvidosa)',
    type: 'consumable',
    effect: { thirst: -20, radiation: 3 },
  },
};
