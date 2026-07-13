/**
 * Ato 1 — Congresso / Esplanada (2150)
 * Protagonista: Aprendiz de Seu Nilo (Telefonista morto)
 * Tom: drama seco + comédia preta
 */

export const nodes = {
  // ─── DESPERTAR ─────────────────────────────────────────────
  inicio_congresso: {
    id: 'inicio_congresso',
    type: 'narrative',
    text: '2150. Você acorda com gosto de ferrugem na boca e o zumbido de um orelhão ao longe — linha ocupada de um país que já morreu. O sol de cobre bate na cúpula descascada do Congresso Nacional, agora uma ilha no Dilúvio Verde. Água tóxica lambe os degraus. Seu Nilo te ensinou: "Se a cabine toca, alguém ainda acredita em voz." Ele não está aqui.',
    choices: [
      {
        text: 'Seguir o som do orelhão',
        nextNodeId: 'caminho_orelhao',
        effects: { stress: 2 },
      },
      {
        text: 'Observar as ruínas ao redor (entender onde você está)',
        nextNodeId: 'olhar_arredor',
      },
      {
        text: 'Vasculhar os escombros mais próximos',
        nextNodeId: 'escombros_congresso',
        effects: { thirst: 5 },
      },
    ],
  },

  olhar_arredor: {
    id: 'olhar_arredor',
    type: 'narrative',
    text: 'O Eixo Monumental virou canal. Placas de "Brasília — Capital da Esperança" boiam de cabeça para baixo. Longe, a Torre de TV torta cospe estática como se ainda tivesse opinião. O povo chama isso de Dilúvio Verde; nos papéis velhos de Nilo, era a Quebra do Cerrado, 2044. Cem anos de gambiarra depois, a capital ainda finge que é cidade.',
    choices: [
      {
        text: 'Ir até o orelhão que toca',
        nextNodeId: 'caminho_orelhao',
      },
      {
        text: 'Descer aos escombros da orla',
        nextNodeId: 'escombros_congresso',
      },
    ],
  },

  escombros_congresso: {
    id: 'escombros_congresso',
    type: 'narrative',
    text: 'Debaixo de uma cadeira de plenário, você acha o que Nilo chamaria de "kit de dignidade mínima": duas fichas grudadas em chiclete antigo e um pedaço de charque duro como lei. O cheiro da água sobe — metal e goiaba azeda.',
    choices: [
      {
        text: 'Pegar as fichas e o charque',
        nextNodeId: 'pos_escombros',
        effects: {
          currency: 2,
          addItems: ['charque_seco'],
          flags: { saqueouEscombros: true },
        },
      },
      {
        text: 'Deixar tudo — foco no orelhão',
        nextNodeId: 'caminho_orelhao',
        effects: { stress: -2 },
      },
    ],
  },

  pos_escombros: {
    id: 'pos_escombros',
    type: 'narrative',
    text: 'As fichas tilintam no bolso como oração barata. O orelhão ao fundo não desiste: toca, corta, toca de novo. Alguém programou essa insistência. Alguém com sotaque de central e paciência de morto.',
    choices: [
      {
        text: 'Seguir o toque',
        nextNodeId: 'caminho_orelhao',
      },
    ],
  },

  // ─── ORELHÃO / NILO ────────────────────────────────────────
  caminho_orelhao: {
    id: 'caminho_orelhao',
    type: 'narrative',
    text: 'A cabine está semi-submersa até o joelho imaginário do usuário. O plástico verde virado cinza. Você deposita o hábito antes da ficha: mão na manivela mental que Nilo te ensinou. A linha puxa. Chiado. Depois, a voz — rouca, gravada, íntima demais.',
    choices: [
      {
        text: 'Atender (-1 Ficha)',
        nextNodeId: 'voz_nilo_1',
        requirements: { currency: 1 },
        effects: { currency: -1, flags: { ouviuNilo: true } },
      },
      {
        text: 'Não gastar ficha — vasculhar a cabine por fora',
        nextNodeId: 'cabine_por_fora',
        effects: { stress: 3 },
      },
    ],
  },

  voz_nilo_1: {
    id: 'voz_nilo_1',
    type: 'narrative',
    text: '"Aprendiz. Se está ouvindo, eu não voltei." Um silêncio de fita. "Siga o protocolo: reative a orla, não negocie com quem cobra swing na Esplanada, e se achar meu corpo… não perca tempo rezando. Reze no cobre." A gravação engasga. "Eles patrulham. Há uma machete no orelhão de trás. A Central do Planalto ainda importa. Eu—" Estática. A linha morre como quem fecha a porta com o pé.',
    choices: [
      {
        text: 'Procurar o orelhão de trás (machete)',
        nextNodeId: 'orelhao_machete',
      },
      {
        text: 'Procurar pistas do corpo de Nilo primeiro',
        nextNodeId: 'pista_corpo',
        effects: { stress: 5 },
      },
      {
        text: 'Ignorar o protocolo e ir ao cemitério de Opalas',
        nextNodeId: 'cemiterio_opalas',
      },
    ],
  },

  cabine_por_fora: {
    id: 'cabine_por_fora',
    type: 'narrative',
    text: 'Sem ficha, a cabine é só um caixão vertical. No vidro embaciado, alguém riscou com prego: "NILO PAGOU A CONTA". Embaixo, uma ficha solta no lodo — sorte de quem ainda fuça.',
    choices: [
      {
        text: 'Pegar a ficha e atender de verdade (-0 agora, +1 ficha)',
        nextNodeId: 'caminho_orelhao',
        effects: { currency: 1 },
      },
      {
        text: 'Seguir para o cemitério de Opalas',
        nextNodeId: 'cemiterio_opalas',
      },
    ],
  },

  orelhao_machete: {
    id: 'orelhao_machete',
    type: 'narrative',
    text: 'Atrás da fileira, uma cabine muda. No chão, como oferenda de santo bravo, a Machete Enferrujada de Nilo — cabo enrolado com fita isolante verde. Você conhece o peso. Ele fazia você cortar cipó até o ombro doer. "Arma de telefonista," dizia. "Porque às vezes a linha só entende aço."',
    choices: [
      {
        text: 'Equipar a machete e seguir o mapa mental da orla',
        nextNodeId: 'encruzilhada_orla',
        effects: {
          addItems: ['machete'],
          flags: { temMachete: true },
        },
      },
    ],
  },

  pista_corpo: {
    id: 'pista_corpo',
    type: 'narrative',
    text: 'Perto da água, uma trilha de botas e um cabo de telefone esticado como veia. Leva a um banco de concreto onde alguém sentou para morrer com dignidade de funcionário público: crachá ilegível, rádio no colo, fita K7 no bolso do peito. O rosto… você não precisa de mais luz. É Nilo. Ou o que o Dilúvio deixou dele.',
    choices: [
      {
        text: 'Pegar a fita e fechar os olhos por um segundo',
        nextNodeId: 'fita_nilo_corpo',
        effects: {
          stress: 12,
          addItems: ['fita_nilo'],
          flags: { achouCorpoNilo: true },
        },
      },
      {
        text: 'Não olhar o rosto — só a fita e a machete do protocolo',
        nextNodeId: 'orelhao_machete',
        effects: {
          stress: 6,
          addItems: ['fita_nilo'],
          flags: { achouCorpoNilo: true },
        },
      },
    ],
  },

  fita_nilo_corpo: {
    id: 'fita_nilo_corpo',
    type: 'narrative',
    text: 'No walkman improvisado do rádio, a fita corre: "Se achou isso, o Aprendiz sobreviveu a mim. Bom. A Central do Planalto guarda o último relé mestre. A Bossa Nova não pode chegar lá primeiro. E Aprendiz… desculpa a lição incompleta. A conta da voz nunca fecha." Clique. Silêncio mais honesto que missa.',
    choices: [
      {
        text: 'Honrar o protocolo — buscar a machete',
        nextNodeId: 'orelhao_machete',
      },
      {
        text: 'Ir direto ao cemitério de Opalas (precisará de recursos)',
        nextNodeId: 'cemiterio_opalas',
      },
    ],
  },

  // ─── EXPLORAÇÃO DA ORLA ────────────────────────────────────
  encruzilhada_orla: {
    id: 'encruzilhada_orla',
    type: 'narrative',
    text: 'Três caminhos na orla do Congresso: o cemitério de carcaças (Opalas e ônibus), a fileira de orelhões mudos como dentes, e a avenida rachada que sobe para a Esplanada — onde a Bossa Nova cobra pedágio em swing e sangue.',
    choices: [
      {
        text: 'Cemitério de Opalas (sucata, risco, recompensa)',
        nextNodeId: 'cemiterio_opalas',
      },
      {
        text: 'Fileira de orelhões (fichas, lore, estática)',
        nextNodeId: 'fileira_orelhoes',
      },
      {
        text: 'Subir para a Esplanada (pedágio da Bossa Nova)',
        nextNodeId: 'aproximar_pedagio',
      },
    ],
  },

  cemiterio_opalas: {
    id: 'cemiterio_opalas',
    type: 'narrative',
    text: 'Opalas em fila de defunto. Um porta-malas entreaberto cospe plástico rosa: Guaraná Jesus, ainda lacrado como milagre de mercearia. Mais adiante, sucata boa — e um barulho de lata. Pode ser vento. Em Brasília, vento também assalta.',
    choices: [
      {
        text: 'Pegar o Guaraná e a sucata (+sede do esforço)',
        nextNodeId: 'opala_saque_ok',
        effects: {
          scrap: 4,
          thirst: 10,
          addItems: ['guarana_jesus'],
          flags: { saqueouOpala: true },
        },
      },
      {
        text: 'Só a sucata — rápido e quieto',
        nextNodeId: 'opala_saque_ok',
        effects: { scrap: 3, thirst: 5, flags: { saqueouOpala: true } },
      },
      {
        text: 'Investigar o barulho de lata',
        nextNodeId: 'opala_emboscada',
        effects: { stress: 4 },
      },
    ],
  },

  opala_saque_ok: {
    id: 'opala_saque_ok',
    type: 'narrative',
    text: 'Nada salta. Só o calor e um adesivo desbotado no para-choque: "Brasil: ame-o ou ligue depois do sinal." Você volta à orla com o bolso mais pesado e a sede fazendo campanha política na garganta.',
    choices: [
      {
        text: 'Voltar à encruzilhada',
        nextNodeId: 'encruzilhada_orla',
      },
      {
        text: 'Ir à fileira de orelhões',
        nextNodeId: 'fileira_orelhoes',
      },
      {
        text: 'Seguir para o pedágio',
        nextNodeId: 'aproximar_pedagio',
      },
    ],
  },

  opala_emboscada: {
    id: 'opala_emboscada',
    type: 'narrative',
    text: 'Não é milícia. É um carcará humano — sucateiro magro com cano de PVC e sorriso de quem já vendeu a própria sombra. "Metade da sucata ou eu grito pra Bossa Nova que tem Telefonista na orla."',
    choices: [
      {
        text: 'Pagar a "taxa" (-3 sucata, paz suja)',
        nextNodeId: 'opala_saque_ok',
        requirements: { scrap: 3 },
        effects: { scrap: -3, stress: 2 },
      },
      {
        text: 'Recusar e encarar (estresse, mas mantém o saque)',
        nextNodeId: 'opala_saque_ok',
        effects: {
          scrap: 2,
          stress: 10,
          health: -5,
          addItems: ['guarana_jesus'],
          flags: { saqueouOpala: true },
        },
      },
      {
        text: 'Fugir de mãos abanando',
        nextNodeId: 'encruzilhada_orla',
        effects: { stress: 5, thirst: 8 },
      },
    ],
  },

  fileira_orelhoes: {
    id: 'fileira_orelhoes',
    type: 'narrative',
    text: 'Cinco cabines. Três mortas. Uma cospe só ocupado eterno — a Igreja do Sinal Ocupado deixou uma garrafa de água e um dente como oferenda. A quinta pisca o LED como olho de sonâmbulo.',
    choices: [
      {
        text: 'Rezar do jeito errado: pegar a água da oferenda',
        nextNodeId: 'fileira_resultado',
        effects: {
          addItems: ['agua_garrafa'],
          stress: 4,
          flags: { roubouOferenda: true },
        },
      },
      {
        text: 'Gastar 1 ficha na cabine que pisca',
        nextNodeId: 'orelhao_esplanada_eco',
        requirements: { currency: 1 },
        effects: { currency: -1 },
      },
      {
        text: 'Vasculhar o cofre arrombado (-tempo, +fichas?)',
        nextNodeId: 'cofre_orelhao',
      },
    ],
  },

  cofre_orelhao: {
    id: 'cofre_orelhao',
    type: 'narrative',
    text: 'Dentro: duas fichas, um cartão de visita da Milícia da Bossa Nova ("Civilidade com reverb") e um bilhete: "Telefonista paga dobro." Nilo tinha inimigos com papel timbrado. Que luxo.',
    choices: [
      {
        text: 'Levar as fichas e sair',
        nextNodeId: 'fileira_resultado',
        effects: { currency: 2, stress: 3 },
      },
    ],
  },

  orelhao_esplanada_eco: {
    id: 'orelhao_esplanada_eco',
    type: 'narrative',
    text: 'Não é Nilo. É um eco da malha — voz feminina de locutora antiga: "Horário de Brasília inexistente. Próxima conexão: Esplanada. Atenção ao pedágio cultural." No fim, um sopro que parece risada dele. Ou interferência. Você decide o que dói menos.',
    choices: [
      {
        text: 'Anotado. Voltar à orla',
        nextNodeId: 'fileira_resultado',
        effects: { stress: -3, flags: { ouviuEcoMalha: true } },
      },
    ],
  },

  fileira_resultado: {
    id: 'fileira_resultado',
    type: 'narrative',
    text: 'A fileira fica para trás, cabines como confissãoais sem padre. À frente, o calor da Esplanada e o baixo distorcido de um rádio de milícia.',
    choices: [
      {
        text: 'Encruzilhada da orla',
        nextNodeId: 'encruzilhada_orla',
      },
      {
        text: 'Ir ao pedágio',
        nextNodeId: 'aproximar_pedagio',
      },
      {
        text: 'Cemitério de Opalas',
        nextNodeId: 'cemiterio_opalas',
      },
    ],
  },

  // ─── PEDÁGIO / BOSSA NOVA ──────────────────────────────────
  aproximar_pedagio: {
    id: 'aproximar_pedagio',
    type: 'narrative',
    text: 'Um Capanga da Bossa Nova bloqueia a avenida com um banquinho de praia e um cano. Jaqueta desbotada, óculos escuros no crepúsculo, rádio portátil tossindo soft-jazz radioativo. "Pedágio da Esplanada. Cinco fichas… ou a gente afina sua garganta. Telefonista paga com juros, viu."',
    choices: [
      {
        text: 'Pagar as 5 fichas (evitar luta)',
        nextNodeId: 'pedagio_pago',
        requirements: { currency: 5 },
        effects: {
          currency: -5,
          flags: { pagouPedagio: true, passouPedagio: true },
        },
      },
      {
        text: 'Barganhar com sucata (precisa de 8+ sucata)',
        nextNodeId: 'pedagio_barganha',
        requirements: { scrap: 8 },
        effects: {
          scrap: -8,
          flags: { barganhouPedagio: true, passouPedagio: true },
        },
      },
      {
        text: 'Oferecer Guaraná Jesus como "cortesia cultural"',
        nextNodeId: 'pedagio_barganha',
        requirements: { item: 'guarana_jesus' },
        effects: {
          removeItem: 'guarana_jesus',
          flags: { barganhouPedagio: true, passouPedagio: true },
        },
      },
      {
        text: 'Recusar — preparar para combate',
        nextNodeId: 'combate_milicia',
        effects: { stress: 5 },
      },
      {
        text: 'Recuar para a orla (juntar recursos)',
        nextNodeId: 'encruzilhada_orla',
      },
    ],
  },

  pedagio_pago: {
    id: 'pedagio_pago',
    type: 'narrative',
    text: 'As fichas somem na mão dele mais rápido que esperança em ano eleitoral. "Civilizado. Pode passar, Operador. E diga ao fantasma do Nilo que a conta de voz dele… continua em aberto." Ele ri. O rádio muda de faixa sozinho.',
    choices: [
      {
        text: 'Atravessar a Esplanada',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },

  pedagio_barganha: {
    id: 'pedagio_barganha',
    type: 'narrative',
    text: 'Ele sopesa o suborno como crítico de arte de boteco. "Tá sujo, mas tem swing." O banquinho de praia é arrastado de lado. "Hoje você comprou civilidade. Amanhã o preço sobe com a maré."',
    choices: [
      {
        text: 'Seguir em frente',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },

  combate_milicia: {
    id: 'combate_milicia',
    type: 'combat',
    text: '"Sem ficha, sem swing, sem passagem!" O Capanga da Bossa Nova ergue o cano. A Esplanada vai decidir em posturas — não em discurso.',
    enemy: {
      name: 'Capanga da Bossa Nova',
      health: 40,
      maxHealth: 40,
      stressAttack: 10,
      position: 'Média',
    },
    onWinNodeId: 'vitoria_milicia',
    onLoseNodeId: 'morte_wasteland',
  },

  vitoria_milicia: {
    id: 'vitoria_milicia',
    type: 'narrative',
    text: 'O capanga tropeça para trás, jaqueta rasgada, orgulho mais rasgado ainda. Foge deixando três fichas e o rádio cuspendo um acorde torto. "A Bossa Nova não esquece, Telefonista!" A avenida, por enquanto, é sua.',
    choices: [
      {
        text: 'Pegar as fichas e avançar',
        nextNodeId: 'esplanada_aberta',
        effects: {
          currency: 3,
          flags: { derrotouCapanga: true, passouPedagio: true },
        },
      },
    ],
  },

  // ─── ESPLANADA / FECHO ATO 1 ───────────────────────────────
  esplanada_aberta: {
    id: 'esplanada_aberta',
    type: 'narrative',
    text: 'A Esplanada das Ruínas se abre: pedra quente, ossos de postes, água verde em poças como olhos. No meio do eixo, um orelhão intacto demais para ser acaso — relé de orla que Nilo marcou nos mapas mentais. Mais adiante, um mirante rachado observa a cidade-pântano.',
    choices: [
      {
        text: 'Reativar o orelhão da Esplanada (-1 Ficha)',
        nextNodeId: 'reativar_orelhao',
        requirements: { currency: 1 },
        effects: { currency: -1 },
      },
      {
        text: 'Subir ao mirante primeiro',
        nextNodeId: 'mirante',
      },
    ],
  },

  reativar_orelhao: {
    id: 'reativar_orelhao',
    type: 'narrative',
    text: 'Você executa o protocolo: ficha, manivela de intenção, três toques no gancho. A cabine estremece. Luz. Depois a voz de Nilo — mais fraca, como quem fala debaixo d\'água: "Orla online. Bom trabalho, Aprendiz. Próximo nó: Central do Planalto. Se a estática engolir esta fita… continue sem mim." A linha estabiliza num zumbido vivo. Pela primeira vez em muito tempo, Brasília tem um ponto que responde.',
    choices: [
      {
        text: 'Ir ao mirante',
        nextNodeId: 'mirante',
        effects: { flags: { reativouOrelhaoEsplanada: true }, stress: -8 },
      },
    ],
  },

  mirante: {
    id: 'mirante',
    type: 'narrative',
    text: 'Do concreto rachado você enxerga o Dilúvio Verde engolindo o plano-piloto. Ilhas de prédio. Fumaça de fogueira de facção. A Torre de TV como dedo acusador. Nilo dizia que um Telefonista não salva o país — só impede o silêncio de ganhar de goleada. A Central do Planalto fica além da névoa leste, ainda apagada desde 2138.',
    choices: [
      {
        text: 'Voltar e reativar o orelhão da Esplanada',
        nextNodeId: 'esplanada_aberta',
        requirements: { notFlag: 'reativouOrelhaoEsplanada' },
      },
      {
        text: 'Assumir o ofício: encerrar o Ato 1',
        nextNodeId: 'ato1_fim',
      },
    ],
  },

  ato1_fim: {
    id: 'ato1_fim',
    type: 'narrative',
    text: 'Fim do Ato 1 — Orla do Congresso. Você é o Aprendiz que enterrou o mestre sem pá: só com linha, sucata e teimosia. A Esplanada conhece seu nome de ofício. A Bossa Nova também. Ao leste, a Central do Planalto espera — e com ela o resto de um Brasil que ainda tenta discar o próprio funeral. Continua…',
    choices: [
      {
        text: 'Revisar a Esplanada (livre)',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },

  morte_wasteland: {
    id: 'morte_wasteland',
    type: 'narrative',
    text: 'Seu corpo cede na terra devastada. O rádio no cinto cospe estática — e, por um segundo cruel, a voz de Nilo: "Aprendiz… a linha…" Depois, nada. Em 2150, até o silêncio tem fila de espera. Fim de jogo.',
    choices: [],
  },
};
