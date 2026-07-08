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
