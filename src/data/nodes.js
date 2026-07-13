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
    speaker: 'Seu Nilo (gravação)',
    text: '"Aprendiz. Se está ouvindo, eu não voltei." Um silêncio de fita. "Siga o protocolo: reative a orla, não negocie com quem cobra swing na Esplanada, e se achar meu corpo… não perca tempo rezando. Reze no cobre." A gravação engasga. "Eles patrulham. Há uma machete no orelhão de trás. A Central do Planalto ainda importa. Eu—" Estática. A linha morre como quem fecha a porta com o pé.',
    choices: [
      {
        text: 'Tentar puxar mais um trecho da fita (-0 ficha, se a linha aguentar)',
        nextNodeId: 'nilo_fita_extra',
      },
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

  nilo_fita_extra: {
    id: 'nilo_fita_extra',
    type: 'narrative',
    speaker: 'Seu Nilo (gravação)',
    text: 'O relé cospe um apêndice rachado: "Se Dona Linha ainda monta barraca na orla… ela te vende ficha cara e verdade barata. Não confie em Tom do Reverb — ele cobra swing até do silêncio. E Aprendiz: se a estática cantar seu nome, não responda de primeira. Pode ser a Igreja. Pode ser eu. Pode ser pior." Clique. Cheiro de ozônio. Saudade com imposto.',
    choices: [
      {
        text: 'Procurar a machete',
        nextNodeId: 'orelhao_machete',
        effects: { flags: { ouviuFitaNiloExtra: true }, stress: 3 },
      },
      {
        text: 'Ir atrás do corpo de Nilo',
        nextNodeId: 'pista_corpo',
        effects: { flags: { ouviuFitaNiloExtra: true }, stress: 6 },
      },
      {
        text: 'Buscar Dona Linha na orla',
        nextNodeId: 'linha_encontro',
        effects: { flags: { ouviuFitaNiloExtra: true } },
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
    text: 'A orla do Congresso se abre em caminhos: cemitério de Opalas, fileira de orelhões, avenida do pedágio… e uma lona esburacada onde alguém ferve água em lata de tinta. Cheiro de café fraco e cobre. Gente ainda teima em viver aqui.',
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
        text: 'Parar na lona da catadora (Dona Linha)',
        nextNodeId: 'linha_encontro',
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
    speaker: 'Guto, o Carcará',
    text: 'Não é milícia. É Guto — sucateiro magro, cano de PVC, sorriso de quem já vendeu a própria sombra duas vezes. "Eita, fardinha de voz. Metade da sucata ou eu grito pra Bossa Nova que tem Telefonista na orla. Não é pessoal, é… política de trânsito."',
    choices: [
      {
        text: 'Conversar: "Quem te paga pra assustar?"',
        nextNodeId: 'guto_dialogo',
        effects: { flags: { conheceuGuto: true } },
      },
      {
        text: 'Pagar a "taxa" (-3 sucata, paz suja)',
        nextNodeId: 'opala_saque_ok',
        requirements: { scrap: 3 },
        effects: { scrap: -3, stress: 2, flags: { conheceuGuto: true } },
      },
      {
        text: 'Recusar e encarar (estresse, mas mantém o saque)',
        nextNodeId: 'opala_saque_ok',
        effects: {
          scrap: 2,
          stress: 10,
          health: -5,
          addItems: ['guarana_jesus'],
          flags: { saqueouOpala: true, conheceuGuto: true },
        },
      },
      {
        text: 'Fugir de mãos abanando',
        nextNodeId: 'encruzilhada_orla',
        effects: { stress: 5, thirst: 8, flags: { conheceuGuto: true } },
      },
    ],
  },

  guto_dialogo: {
    id: 'guto_dialogo',
    type: 'narrative',
    speaker: 'Guto, o Carcará',
    text: 'Guto cospe no chão (o chão não reclama). "Ninguém me paga. A Bossa Nova só escuta barulho. Eu vendo o barulho. Seu Nilo… ele me dava ficha pra eu calar a boca. Homem justo. Morto, né? Justiça no Brasil sempre vem póstuma." Ele abana o cano. "Então: taxa, fuga, ou a gente finge que foi vento?"',
    choices: [
      {
        text: '"Nilo te pagava. Me dá desconto de aprendiz." (-1 sucata)',
        nextNodeId: 'opala_saque_ok',
        requirements: { scrap: 1 },
        effects: {
          scrap: -1,
          stress: -2,
          addItems: ['guarana_jesus'],
          flags: { saqueouOpala: true },
        },
      },
      {
        text: 'Pagar taxa cheia (-3 sucata)',
        nextNodeId: 'opala_saque_ok',
        requirements: { scrap: 3 },
        effects: { scrap: -3, flags: { saqueouOpala: true } },
      },
      {
        text: 'Encerrar papo na porrada de olhar (sair com pouco)',
        nextNodeId: 'opala_saque_ok',
        effects: { scrap: 1, stress: 6, flags: { saqueouOpala: true } },
      },
    ],
  },

  fileira_orelhoes: {
    id: 'fileira_orelhoes',
    type: 'narrative',
    text: 'Cinco cabines. Três mortas. Uma cospe ocupado eterno — e uma mulher de manto feito de capas de lista telefônica murmura junto. A Igreja do Sinal Ocupado deixou água e um dente. A quinta cabine pisca o LED como olho de sonâmbulo.',
    choices: [
      {
        text: 'Falar com a mulher do manto (Irmã Ocupada)',
        nextNodeId: 'irma_encontro',
      },
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
    speaker: 'Tom do Reverb',
    text: 'O pedágio tem nome: Tom do Reverb. Banquinho de praia, cano, jaqueta desbotada, óculos escuros no crepúsculo. Rádio portátil tossindo soft-jazz radioativo. "Pedágio da Esplanada. Cinco fichas… ou a gente afina sua garganta. Telefonista paga com juros, viu. Eu sou o Tom. O reverb é cortesia."',
    choices: [
      {
        text: 'Conversar com Tom (antes de pagar ou brigar)',
        nextNodeId: 'tom_hub',
        effects: { flags: { falouComTom: true } },
      },
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
        effects: { stress: 5, flags: { tomOfendido: true } },
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
    speaker: 'Tom do Reverb',
    text: 'As fichas somem na mão de Tom mais rápido que esperança em ano eleitoral. "Civilizado. Pode passar, Operador. E diga ao fantasma do Nilo que a conta de voz dele… continua em aberto." Ele ri. O rádio muda de faixa sozinho — como se concordasse.',
    choices: [
      {
        text: 'Perguntar o que Nilo devia a ele',
        nextNodeId: 'tom_divida_nilo',
      },
      {
        text: 'Atravessar a Esplanada em silêncio',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },

  pedagio_barganha: {
    id: 'pedagio_barganha',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: 'Tom sopesa o suborno como crítico de arte de boteco. "Tá sujo, mas tem swing." O banquinho de praia é arrastado de lado. "Hoje você comprou civilidade. Amanhã o preço sobe com a maré. A Bossa Nova não faz promoção de aniversário."',
    choices: [
      {
        text: '"Você tem medo da Central do Planalto?"',
        nextNodeId: 'tom_central',
      },
      {
        text: 'Seguir em frente',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },

  combate_milicia: {
    id: 'combate_milicia',
    type: 'combat',
    text: '"Sem ficha, sem swing, sem passagem!" Tom do Reverb ergue o cano. O rádio grita um solo torto. A Esplanada vai decidir em posturas — não em discurso.',
    enemy: {
      name: 'Tom do Reverb',
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
    speaker: 'Tom do Reverb',
    text: 'Tom tropeça para trás, jaqueta rasgada, orgulho mais rasgado ainda. "Você… tem o mesmo vício do Nilo. Achar que linha resolve tudo." Foge deixando três fichas e o rádio cuspendo um acorde torto. "A Bossa Nova não esquece, Aprendiz!"',
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
    text: 'A Esplanada das Ruínas se abre: pedra quente, ossos de postes, água verde em poças como olhos. No meio do eixo, um orelhão intacto demais para ser acaso — relé de orla que Nilo marcou nos mapas mentais. Mais adiante, um mirante rachado. Se você humilhou Tom, o vento às vezes carrega um rádio magoado.',
    choices: [
      {
        text: 'Reativar o orelhão da Esplanada (-1 Ficha)',
        nextNodeId: 'reativar_orelhao',
        requirements: { currency: 1, notFlag: 'reativouOrelhaoEsplanada' },
        effects: { currency: -1 },
      },
      {
        text: 'Investigar um rádio abandonado (Tom?)',
        nextNodeId: 'tom_eco_esplanada',
        requirements: { flag: 'derrotouCapanga' },
      },
      {
        text: 'Subir ao mirante',
        nextNodeId: 'mirante',
      },
      {
        text: 'Descer de volta à orla',
        nextNodeId: 'encruzilhada_orla',
      },
    ],
  },

  reativar_orelhao: {
    id: 'reativar_orelhao',
    type: 'narrative',
    speaker: 'Seu Nilo (gravação)',
    text: 'Você executa o protocolo: ficha, manivela de intenção, três toques no gancho. A cabine estremece. Luz. A voz de Nilo — mais fraca, como quem fala debaixo d\'água: "Orla online. Bom trabalho, Aprendiz. Próximo nó: Central do Planalto. Se a estática engolir esta fita… continue sem mim. E se cruzar a Linha… diga que a conta do café ficou pra próxima vida." A linha estabiliza num zumbido vivo. Brasília tem um ponto que responde.',
    choices: [
      {
        text: 'Perguntar à linha se Nilo ainda "ouve"',
        nextNodeId: 'nilo_pos_rele',
        effects: { flags: { reativouOrelhaoEsplanada: true }, stress: -5 },
      },
      {
        text: 'Ir ao mirante',
        nextNodeId: 'mirante',
        effects: { flags: { reativouOrelhaoEsplanada: true }, stress: -8 },
      },
    ],
  },

  nilo_pos_rele: {
    id: 'nilo_pos_rele',
    type: 'narrative',
    speaker: 'Seu Nilo (eco da malha)',
    text: 'Só estática… depois um sopro: "Eu não ouço. Eu repito. É diferente. Aprendiz, não faça da minha voz um deus. Faça dela um fio. Fios se emendar. Deuses só cobram pedágio." A cabine esfria. O ofício, não.',
    choices: [
      {
        text: 'Aceitar a lição e ir ao mirante',
        nextNodeId: 'mirante',
        effects: { stress: -4 },
      },
    ],
  },

  tom_eco_esplanada: {
    id: 'tom_eco_esplanada',
    type: 'narrative',
    speaker: 'Rádio de Tom (abandonado)',
    text: 'O rádio que Tom largou ainda cospe jazz com chiado. De repente, a voz dele — gravada ou ao vivo, difícil saber: "Aprendiz… se reativou a orla, a chefia vai saber. Eu não volto fraco. Eu volto com banda." Estática. Um último acorde. Ameaça com arranjo.',
    choices: [
      {
        text: 'Desligar o rádio com o pé',
        nextNodeId: 'esplanada_aberta',
        effects: { stress: 4 },
      },
      {
        text: 'Deixar tocando — informação também é arma',
        nextNodeId: 'esplanada_aberta',
        effects: { stress: 2 },
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

  // ─── NPC: DONA LINHA ───────────────────────────────────────
  linha_encontro: {
    id: 'linha_encontro',
    type: 'narrative',
    speaker: 'Dona Linha',
    text: 'Debaixo da lona, uma mulher de cabelos brancos trançados com fio de telefone ferve lata de tinta. Olhos de quem já viu o Dilúvio subir e descer. "Senta, Aprendiz. Cheiro de central em você. Nilo te mandou… ou a fome?"',
    choices: [
      {
        text: '"Nilo me ensinou. Ele morreu."',
        nextNodeId: 'linha_hub',
        effects: { flags: { conheceuDonaLinha: true }, stress: 2 },
      },
      {
        text: '"Só quero comércio. Ficha por sucata."',
        nextNodeId: 'linha_hub',
        effects: { flags: { conheceuDonaLinha: true } },
      },
      {
        text: 'Desculpar-se e voltar à encruzilhada',
        nextNodeId: 'encruzilhada_orla',
      },
    ],
  },

  linha_hub: {
    id: 'linha_hub',
    type: 'narrative',
    speaker: 'Dona Linha',
    text: 'Dona Linha mexe a panela. "Eu troco, eu fofoco, eu não rezo. Escolhe o serviço. Só não me peça milagre — milagre em Brasília virou pedágio."',
    choices: [
      {
        text: 'Perguntar sobre Seu Nilo',
        nextNodeId: 'linha_sobre_nilo',
      },
      {
        text: 'Perguntar sobre a Bossa Nova / Tom',
        nextNodeId: 'linha_sobre_bossa',
      },
      {
        text: 'Trocar 3 sucatas por 1 ficha',
        nextNodeId: 'linha_troca_ok',
        requirements: { scrap: 3, notFlag: 'trocouSucataLinha' },
        effects: {
          scrap: -3,
          currency: 1,
          flags: { trocouSucataLinha: true },
        },
      },
      {
        text: 'Trocar charque por 1 ficha',
        nextNodeId: 'linha_troca_ok',
        requirements: { item: 'charque_seco', notFlag: 'trocouSucataLinha' },
        effects: {
          removeItem: 'charque_seco',
          currency: 1,
          flags: { trocouSucataLinha: true },
        },
      },
      {
        text: '"Obrigado, Dona Linha." (sair)',
        nextNodeId: 'encruzilhada_orla',
        effects: { stress: -3 },
      },
    ],
  },

  linha_sobre_nilo: {
    id: 'linha_sobre_nilo',
    type: 'narrative',
    speaker: 'Dona Linha',
    text: '"Nilo era teimoso igual fio desencapado. Vinha aqui, tomava café de lata, falava que a Central do Planalto ainda respirava. Eu dizia: homem, respira quem tem pulmão. Ele ria. Semana passada… o rir parou. Achei ele perto da água. Não mexi no corpo. Telefonista tem direito a pose final." Ela te olha. "Você é a pose que anda."',
    choices: [
      {
        text: 'Agradecer a honestidade (voltar ao menu dela)',
        nextNodeId: 'linha_hub',
        effects: { flags: { ouviuFofocaNilo: true }, stress: 4 },
      },
      {
        text: 'Perguntar se ela sabe do corpo ainda lá',
        nextNodeId: 'linha_corpo',
        effects: { flags: { ouviuFofocaNilo: true } },
      },
    ],
  },

  linha_corpo: {
    id: 'linha_corpo',
    type: 'narrative',
    speaker: 'Dona Linha',
    text: '"Tava. Pode ter sido a maré, pode ter sido a Bossa Nova fazendo limpeza estética. Se for achar, leva fita. Morto de Nilo sempre deixa recado — ele era burocrático até na hora de ir."',
    choices: [
      {
        text: 'Voltar ao que ela oferece',
        nextNodeId: 'linha_hub',
      },
      {
        text: 'Ir procurar o corpo agora',
        nextNodeId: 'pista_corpo',
        effects: { stress: 3 },
      },
    ],
  },

  linha_sobre_bossa: {
    id: 'linha_sobre_bossa',
    type: 'narrative',
    speaker: 'Dona Linha',
    text: '"Tom do Reverb acha que é DJ de apocalipse. Cobra cinco fichas e um discurso. Se não tiver ficha, leva Guaraná — ele é vaidoso. Se não tiver nada, reza ou corre. A milícia odeia Telefonista porque voz grátis ameaça o pedágio do boato. Simples. Feio. Brasileiro."',
    choices: [
      {
        text: 'Anotar mentalmente e voltar',
        nextNodeId: 'linha_hub',
        effects: { stress: -2 },
      },
      {
        text: 'Ir direto ao pedágio',
        nextNodeId: 'aproximar_pedagio',
      },
    ],
  },

  linha_troca_ok: {
    id: 'linha_troca_ok',
    type: 'narrative',
    speaker: 'Dona Linha',
    text: 'Ela conta a ficha duas vezes, como se o Dilúvio pudesse ter comido o número. "Negócio fechado. Não volta pedindo fiado — fiado morreu em 2044 junto com o cerrado." Um quase-sorriso. "Quase."',
    choices: [
      {
        text: 'Continuar conversando',
        nextNodeId: 'linha_hub',
      },
      {
        text: 'Partir',
        nextNodeId: 'encruzilhada_orla',
      },
    ],
  },

  // ─── NPC: IRMÃ OCUPADA ─────────────────────────────────────
  irma_encontro: {
    id: 'irma_encontro',
    type: 'narrative',
    speaker: 'Irmã Ocupada',
    text: 'A mulher ergue o rosto. O manto de capas amarelas farfalha. "Shhh. A linha está ocupada com Deus." No fundo, o orelhão canta o ocupado eterno — bip bip bip, litania. "Você carrega cheiro de mentor morto. Quer absolvição ou horário de funcionamento?"',
    choices: [
      {
        text: '"Quero entender a estática."',
        nextNodeId: 'irma_hub',
        effects: { flags: { conheceuIrmaOcupada: true } },
      },
      {
        text: '"Quero só passar. Sem sermão."',
        nextNodeId: 'fileira_resultado',
        effects: { flags: { conheceuIrmaOcupada: true }, stress: 2 },
      },
      {
        text: 'Roubar a oferenda na cara dela',
        nextNodeId: 'irma_ofensa',
        effects: {
          addItems: ['agua_garrafa'],
          stress: 8,
          flags: { roubouOferenda: true, conheceuIrmaOcupada: true },
        },
      },
    ],
  },

  irma_hub: {
    id: 'irma_hub',
    type: 'narrative',
    speaker: 'Irmã Ocupada',
    text: '"A Igreja do Sinal Ocupado acredita: enquanto houver bip, o país não morreu de vez. Silêncio total é o inferno. Nilo… ele zombava da gente. Mas deixava ficha na cabine. Ateu generoso." Ela aponta o LED. "Aquela pisca pra quem ainda discou o nome dele."',
    choices: [
      {
        text: 'Perguntar se a estática é Nilo',
        nextNodeId: 'irma_estatica',
      },
      {
        text: 'Pedir bênção barata (-1 stress, +1 radiação simbólica?)',
        nextNodeId: 'irma_bencao',
        effects: { stress: -6, radiation: 2 },
      },
      {
        text: 'Despedir-se e explorar as cabines',
        nextNodeId: 'fileira_resultado',
      },
    ],
  },

  irma_estatica: {
    id: 'irma_estatica',
    type: 'narrative',
    speaker: 'Irmã Ocupada',
    text: '"Às vezes é Nilo. Às vezes é a malha soluçando. Às vezes é você ouvindo o que precisa ouvir pra não largar o ofício. Fé de Telefonista e fé de Igreja: as duas usam ficha." Ela ri baixo. "Diferença? Nós admitimos o milagre. Vocês chamam de protocolo."',
    choices: [
      {
        text: 'Voltar ao que ela oferece',
        nextNodeId: 'irma_hub',
        effects: { stress: -2 },
      },
      {
        text: 'Gastar ficha na cabine que pisca',
        nextNodeId: 'orelhao_esplanada_eco',
        requirements: { currency: 1 },
        effects: { currency: -1 },
      },
    ],
  },

  irma_bencao: {
    id: 'irma_bencao',
    type: 'narrative',
    speaker: 'Irmã Ocupada',
    text: 'Ela traça um círculo no ar com o dedo sujo — como discar sem disco. "Que sua linha não caia. Que seu stress encontre ocupado. Que o Dilúvio Verde te recuse por um dia." O peito alivia. A pele formiga. Bênção com efeito colateral: clássico.',
    choices: [
      {
        text: 'Amém analógico — sair',
        nextNodeId: 'fileira_resultado',
      },
      {
        text: 'Ficar mais um pouco',
        nextNodeId: 'irma_hub',
      },
    ],
  },

  irma_ofensa: {
    id: 'irma_ofensa',
    type: 'narrative',
    speaker: 'Irmã Ocupada',
    text: '"Ladrão de oferenda." A voz dela não sobe — desce. "Leva a água. Leva a sede que vem depois. A linha vai lembrar seu rosto no ocupado." Você sente o olhar da cabine. Paranoia de plástico. Funciona.',
    choices: [
      {
        text: 'Sair com a garrafa e a vergonha',
        nextNodeId: 'fileira_resultado',
        effects: { stress: 5 },
      },
    ],
  },

  // ─── NPC: TOM DO REVERB (diálogo) ──────────────────────────
  tom_hub: {
    id: 'tom_hub',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: 'Tom ajeita o óculos que não precisa. "Pode falar, Aprendiz. Só não me faça perder o tempo do solo. Tempo também tem pedágio."',
    choices: [
      {
        text: '"Por que odeiam Telefonistas?"',
        nextNodeId: 'tom_odio',
      },
      {
        text: '"Você conheceu o Nilo?"',
        nextNodeId: 'tom_nilo',
      },
      {
        text: '"Cinco fichas é abuso."',
        nextNodeId: 'tom_preco',
      },
      {
        text: 'Encerrar papo — voltar às opções do pedágio',
        nextNodeId: 'aproximar_pedagio',
      },
    ],
  },

  tom_odio: {
    id: 'tom_odio',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: '"Odeio é palavra feia. A gente prefere… regular. Vocês ligam de graça pro pânico, pro boato, pra esperança. Esperança sem taxa desvaloriza o meu freestyle. A Bossa Nova vende civilidade. Vocês distribuem sinal. Concorrência desleal, irmão."',
    choices: [
      {
        text: 'Voltar ao menu do Tom',
        nextNodeId: 'tom_hub',
      },
      {
        text: 'Ir às opções de pagamento/luta',
        nextNodeId: 'aproximar_pedagio',
      },
    ],
  },

  tom_nilo: {
    id: 'tom_nilo',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: '"Nilo me devia uma música e uma desculpa. Passou por aqui com cara de quem ia consertar o Brasil com alicate. Eu cobrei pedágio. Ele pagou… em sermão. Depois sumiu. Agora você aparece com a mesma cara. Déjà-vu com juros."',
    choices: [
      {
        text: '"O que ele devia de verdade?"',
        nextNodeId: 'tom_divida_nilo',
      },
      {
        text: 'Voltar ao menu',
        nextNodeId: 'tom_hub',
      },
    ],
  },

  tom_preco: {
    id: 'tom_preco',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: '"Abuso é silêncio de graça. Cinco fichas é promoção de fim de mundo. Aceito sucata se brilhar. Aceito Guaraná se gelar a alma. Aceito porrada se você insistir em ser romance." Ele bate no cano no ritmo do rádio. "Daí o reverb fica… pessoal."',
    choices: [
      {
        text: 'Voltar às opções do pedágio',
        nextNodeId: 'aproximar_pedagio',
        effects: { stress: 2 },
      },
    ],
  },

  tom_divida_nilo: {
    id: 'tom_divida_nilo',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: 'Tom baixa o tom (e o volume do rádio, milagre). "Ele prometeu não reativar a orla sem avisar a gente. Avisar = pagar. Ele reativava escondido. Cada orelhão online é um pedágio a menos na narrativa da Bossa Nova. Por isso a conta continua aberta. Você herdou a dívida com o ofício. Parabéns."',
    choices: [
      {
        text: 'Seguir pela Esplanada',
        nextNodeId: 'esplanada_aberta',
        effects: { stress: 5 },
      },
      {
        text: 'Ficar em silêncio e atravessar',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },

  tom_central: {
    id: 'tom_central',
    type: 'narrative',
    speaker: 'Tom do Reverb',
    text: 'Ele ri sem boca. "Medo? Eu tenho respeito. A Central do Planalto é o último microfone do país. Quem puser a mão lá primeiro manda no bisbilhoteiro coletivo. A Bossa Nova quer o palco. Vocês querem o fio. A plateia… é o Dilúvio." O banquinho range. "Passa. Enquanto a promoção vale."',
    choices: [
      {
        text: 'Atravessar',
        nextNodeId: 'esplanada_aberta',
      },
    ],
  },
};
