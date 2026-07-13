import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { nodes } from '../data/nodes';

const STANCES = [
  { id: 'Cover', label: 'Abrigo' },
  { id: 'Melee', label: 'Corpo a corpo' },
  { id: 'Ranged', label: 'À distância' },
];

export default function CombatPanel() {
  const { currentNodeId, combatState, selectStance, executeCombatTurn, player } =
    useGameStore();
  const node = nodes[currentNodeId];
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatState?.log?.length]);

  if (!node || node.type !== 'combat' || !combatState) return null;

  const enemy = node.enemy;
  const fightOver =
    combatState.enemyHealth <= 0 || player.health <= 0 || player.stress >= 100;
  const enemyHpPct = Math.max(
    0,
    Math.min(100, (combatState.enemyHealth / enemy.health) * 100)
  );

  return (
    <div
      className="main-panel"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gap: '20px',
        height: '100%',
        padding: '30px',
      }}
    >
      <div className="combat-header">
        <div>
          <h2 style={{ margin: 0, textTransform: 'uppercase' }}>
            Combate: {enemy.name}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-orange-rust)' }}>
            Distância: {enemy.position}
          </span>
          {node.text && (
            <p style={{ margin: '8px 0 0', fontSize: '0.9rem', opacity: 0.85 }}>
              {node.text}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            Vida inimiga: {combatState.enemyHealth} / {enemy.health}
          </div>
          <div className="enemy-hp-bar">
            <div className="enemy-hp-fill" style={{ width: `${enemyHpPct}%` }} />
          </div>
        </div>
      </div>

      <div className="combat-log">
        {combatState.log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="combat-actions">
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '5px',
            }}
          >
            Selecionar Postura
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {STANCES.map((stance) => (
              <button
                key={stance.id}
                className={`combat-btn ${
                  combatState.playerStance === stance.id ? 'active' : ''
                }`}
                disabled={fightOver}
                onClick={() => selectStance(stance.id)}
              >
                {stance.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span
            style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '5px',
            }}
          >
            Ações
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="combat-btn"
              disabled={fightOver}
              onClick={() => executeCombatTurn('attack')}
            >
              Atacar
            </button>
            <button
              className="combat-btn"
              disabled={fightOver}
              onClick={() => executeCombatTurn('recover')}
            >
              Descansar
            </button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
            Postura: {combatState.playerStance} · Munição: {player.ammo}
          </div>
        </div>
      </div>
    </div>
  );
}
