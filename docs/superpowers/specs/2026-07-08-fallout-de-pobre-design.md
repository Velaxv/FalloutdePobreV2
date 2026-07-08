# GDD (Game Design Document) - Fallout de Pobre V2

## 1. Resumo Executivo & Pitch

* **Nome do Projeto (Code Name):** Fallout de Pobre V2
* **Gênero:** RPG de Sobrevivência Narrativo Textual com Combate Tático por Posturas
* **Plataforma:** Web (Browser)
* **Público-alvo:** Fãs de RPGs clássicos, CRPGs narrativos (Disco Elysium, Fallout 1 & 2, Planescape: Torment) e jogos de sobrevivência focados em gerenciamento (Frostpunk, Darkest Dungeon).
* **Stack Tecnológica:** React 18+ (SPA), Vite, Zustand (Gerenciamento de Estado), CSS Vanilla (Temática Retro-futurista CRT).

### Pitch
*Fallout de Pobre* é um jogo de RPG e sobrevivência pós-apocalíptico situado em um "Retrofuturismo Tropical" — um Brasil alternativo devastado no final dos anos 1980. O jogador assume o papel de um **Telefonista da Terra Devastada**, cuja missão é reconectar o que sobrou da comunicação analógica nacional. Enfrente milícias da Bossa Nova, gerencie seus escassos recursos (onde a moeda corrente são as raras **Fichas de Orelhão**), controle seu stress psicológico e participe de combates por turnos baseados em posturas para sobreviver no pântano tóxico que consumiu Brasília.

---

## 2. Direção de Arte & Visual

A direção de arte baseia-se em tecnologia analógica obsoleta, brutalismo arquitetônico brasileiro e iconografia nostálgica.
A interface inteira emula um antigo monitor de fósforo verde (CRT) com cantos arredondados, cintilação suave e scanlines animadas.

### Referências de Mockups de UI Gerados:
1. **Tela Principal (Gameplay & Escolhas Narrativas):**
   * Interface estilo terminal escuro com letreiros verde-fósforo, laranja-ferrugem e tons sépia.
   * Painel esquerdo dedicado a mostradores analógicos (vida, stress, radiação).
   * Painel central com texto descritivo e opções de escolha com estilo brutalista.
2. **Tela de Inventário (Gestão de Sobrevivência):**
   * Grade de itens (Grid) sob molduras de metal enferrujado e papel manchado.
   * Itens com forte brasilidade pós-apocalíptica: Garrafa rosa brilhante de *Guaraná Jesus*, Machete enferrujada e rádio de válvulas danificado.
3. **Cenário de Fundo (Concept Art):**
   * As ruínas do Congresso Nacional projetadas por Oscar Niemeyer semi-submersas em um pântano tóxico verde, cercadas por vegetação mutante exuberante sob o pôr do sol cinzento.

---

## 3. Mecânicas de Jogo (Core Systems)

### A. Atributos e Vitais do Jogador
1. **Vida (Health - HP) [0-100]:** Capacidade física do protagonista. Zera = Fim de Jogo.
2. **Stress (Tensão) [0-100]:** Saúde mental. Sobe ao tomar críticas, tomar sustos ou errar testes.
   * Ao bater 100 de Stress, há um **Teste de Determinação**:
     * *Afligido (75%):* O personagem ganha debuffs como Pânico (-precisão), Paranoia (recusa itens) ou Pão-duro (recusa gastar Fichas).
     * *Virtuoso (25%):* Ganha bônus de combate como Destemido (+dano/cura stress) ou Gambiarrista (bônus com sucata).
3. **Radiação [0-100]:** Acúmulo de radiação. Reduz diretamente a Vida máxima útil do jogador. Curável com cachaça ou antirad.

### B. Consumíveis e Economia
1. **Fome [0-100%]:** Saciada com rações (Farofa de Mutuca, Charque).
2. **Sede [0-100%]:** Saciada com água mutante purificada ou *Guaraná Jesus* (-Stress, -Sede).
3. **Fichas de Orelhão:** Moeda do jogo. Usada para salvar progresso, ligar para contatos das facções ou comerciar.
4. **Sucata (Scrap):** Recurso usado para manter e reparar armas e o rádio analógico.

### C. Combate por Posturas (Stances)
O combate é travado por turnos, simulando um posicionamento tático (Distância Relativa) do protagonista único contra os inimigos:
1. **Postura Corpo a Corpo (Melee):** Alta precisão e dano alto de curta distância (machete). Aumenta o dano sofrido.
2. **Postura Abrigo (Cover):** Alta esquiva e redução de stress. Turno de recuperação de fôlego, recarga de munição ou uso de itens.
3. **Postura à Distância (Ranged):** Usa armas de fogo. Consome munição. Perfeito para atingir inimigos recuados, mas vulnerável se for encurralado.

---

## 4. Arquitetura de Software (React + Zustand + CSS)

### Fluxo de Estados: Grafo de Nós Narrativos (`GameNode`)
O jogo é guiado por uma estrutura de dados de nós no formato JSON. O estado global armazena apenas o `currentNodeId`. O componente correspondente no React decide como renderizar a UI baseado no `type` do nó atual:
* `narrative`: Renderiza texto, imagem e botões de escolha.
* `combat`: Substitui a tela narrativa por uma interface de combate por turnos ativa com o monstro/miliciano indicado no nó.
* `travel`: Mostra o mapa analógico de Brasília para transição entre regiões.

#### Zustand Store Schema:
```javascript
{
  player: {
    health: 100,
    maxHealth: 100,
    stress: 0,
    radiation: 0,
    hunger: 0,
    thirst: 0,
    currency: 3, // Fichas
    scrap: 5,
    ammo: 2
  },
  inventory: [
    { id: "guarana_jesus", name: "Guaraná Jesus", quantity: 1, type: "consumable" },
    { id: "machete", name: "Machete Enferrujada", quantity: 1, type: "weapon", equipped: true }
  ],
  currentNodeId: "inicio_congresso",
  // Métodos de mutação:
  changeNode: (nodeId) => {},
  modifyPlayerStat: (stat, val) => {},
  useItem: (itemId) => {},
  executeCombatTurn: (action) => {}
}
```

---

## 5. Escopo do MVP (Minimum Viable Product)

O protótipo inicial contemplará:
1. **CRT Visual Layout:** Tela com scanlines animadas, tipografia de fósforo verde e gauges analógicos de Vida/Stress/Radiação no painel esquerdo.
2. **Ciclo de 6 Nós Narrativos:** Começando no Congresso Nacional inundado até o primeiro orelhão ativo.
3. **Um Encontro de Combate Completo:** Contra um Capanga da Bossa Nova com a mecânica de 3 Posturas táticas de combate funcionando.
4. **Painel de Inventário:** Mostrando o Guaraná Jesus consumível e a Machete equipada, atualizando os gauges em tempo real ao usar.
