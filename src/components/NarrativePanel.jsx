import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { nodes } from '../data/nodes';

function requirementHint(req, player, inventory, flags) {
  if (!req) return '';
  if (req.currency != null && player.currency < req.currency) {
    return ' (Fichas insuficientes)';
  }
  if (req.scrap != null && player.scrap < req.scrap) {
    return ' (Sucata insuficiente)';
  }
  if (req.item && !inventory.some((i) => i.id === req.item && i.quantity > 0)) {
    return ' (Item necessário)';
  }
  if (req.flag && !flags[req.flag]) {
    return ' (Ainda não)';
  }
  if (req.notFlag && flags[req.notFlag]) {
    return '';
  }
  return ' (Indisponível)';
}

export default function NarrativePanel() {
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const player = useGameStore((s) => s.player);
  const inventory = useGameStore((s) => s.inventory);
  const flags = useGameStore((s) => s.flags);
  const choose = useGameStore((s) => s.choose);
  const meetsRequirements = useGameStore((s) => s.meetsRequirements);

  const node = nodes[currentNodeId];
  const [displayedText, setDisplayedText] = useState('');
  const [textComplete, setTextComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setTextComplete(false);
    if (!node || node.type !== 'narrative') return;

    let index = 0;
    const fullText = node.text;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        setTextComplete(true);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [currentNodeId, node]);

  if (!node || node.type !== 'narrative') return null;

  const visibleChoices = (node.choices || []).filter((choice) => {
    // Esconde opções que exigem notFlag já cumprido (ex.: "voltar se ainda não reativou")
    if (choice.requirements?.notFlag && flags[choice.requirements.notFlag]) {
      return false;
    }
    return true;
  });

  return (
    <div className="main-panel">
      <div className="dialogue-text">{displayedText}</div>
      <div className="choices-list">
        {textComplete &&
          visibleChoices.map((choice, i) => {
            const allowed = meetsRequirements(choice.requirements);
            return (
              <button
                key={`${choice.nextNodeId}-${i}`}
                className="choice-button"
                disabled={!allowed}
                onClick={() => choose(choice)}
              >
                {choice.text}
                {!allowed
                  ? requirementHint(choice.requirements, player, inventory, flags)
                  : ''}
              </button>
            );
          })}
        {textComplete && visibleChoices.length === 0 && (
          <p style={{ color: 'var(--color-phosphor-green-dim)', margin: 0 }}>
            — Transmissão encerrada —
          </p>
        )}
      </div>
    </div>
  );
}
