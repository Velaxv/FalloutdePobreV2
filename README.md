# Fallout de Pobre V2

RPG de sobrevivência **narrativo textual** com combate tático por posturas, ambientado em um Brasil pós-apocalíptico de **retrofuturismo tropical**. Interface em estilo **CRT** (fósforo verde).

Você é um **Telefonista da Terra Devastada**. A moeda são **Fichas de Orelhão**. Gerencie vida, stress, fome e sede enquanto reconecta o que sobrou da comunicação analógica nacional.

## Stack

- React 19 + Vite 8
- Zustand (estado do jogo)
- CSS vanilla (tema CRT)
- Vitest (testes da store)

## Como rodar localmente

1. Instalar dependências:

```bash
npm install
```

2. Servidor de desenvolvimento:

```bash
npm run dev
```

3. Testes unitários:

```bash
npm run test
```

4. Build de produção:

```bash
npm run build
npm run preview
```

## Como jogar (Ato 1)

**Ano:** 2150 · **Lugar:** Brasília / Dilúvio Verde · **Você:** Aprendiz do Telefonista **Seu Nilo**

1. Acorde nas ruínas do **Congresso** e siga o orelhão (voz/protocolo de Nilo).
2. Explore a orla: escombros, **cemitério de Opalas**, fileira de cabines.
3. No **pedágio da Bossa Nova**, escolha: **pagar**, **barganhar** ou **lutar**.
4. Reative o orelhão da Esplanada e feche o Ato 1 (gancho: Central do Planalto).
5. Em combate, use posturas:
   - **Abrigo** — defesa / descansar
   - **Corpo a corpo** — alto dano, mais risco
   - **À distância** — alto dano, gasta munição
6. Consumíveis (Guaraná, charque, água) baixam fome/sede/stress — com tradeoffs.

## Estrutura do projeto

```
src/
  components/   # CRT, gauges, narrativa, inventário, combate
  data/         # Grafo de nós narrativos
  store/        # Zustand + testes
  styles/       # main, CRT, componentes
docs/
  superpowers/  # GDD e plano do MVP
```

## Documentação de design

- GDD: `docs/superpowers/specs/2026-07-08-fallout-de-pobre-design.md`
- Plano MVP: `docs/superpowers/plans/2026-07-08-fallout-de-pobre-mvp.md`

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Bundle em `dist/` |
| `npm run preview` | Preview do build |
| `npm run test` | Testes Vitest |
| `npm run lint` | Oxlint |

## Status do MVP

Protótipo jogável de ponta a ponta:

- [x] Layout CRT com scanlines
- [x] Gauges de vida / stress / radiação
- [x] Ciclo narrativo (~6 nós)
- [x] Combate por posturas
- [x] Inventário com consumível
- [x] Testes da store

## Licença

Projeto privado / protótipo de demonstração.
