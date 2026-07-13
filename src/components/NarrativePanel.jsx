import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { nodes } from '../data/nodes';

export default function NarrativePanel() {
  const { currentNodeId, player, changeNode, modifyPlayerStat, addItemToInventory } =
    useGameStore();
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
    }, 15);

    return () => clearInterval(interval);
  }, [currentNodeId, node]);

  if (!node || node.type !== 'narrative') return null;

  const checkRequirement = (req) => {
    if (!req) return true;
    if (req.currency && player.currency < req.currency) return false;
    return true;
  };

  const applyChoiceEffects = (effects) => {
    if (!effects) return;

    if (effects.currency) modifyPlayerStat('currency', effects.currency);
    if (effects.stress) modifyPlayerStat('stress', effects.stress);
    if (effects.scrap) modifyPlayerStat('scrap', effects.scrap);
    if (effects.thirst) modifyPlayerStat('thirst', effects.thirst);
    if (effects.hunger) modifyPlayerStat('hunger', effects.hunger);
    if (effects.health) modifyPlayerStat('health', effects.health);
    if (effects.radiation) modifyPlayerStat('radiation', effects.radiation);

    if (effects.hasMachete) {
      addItemToInventory({
        id: 'machete',
        name: 'Machete Enferrujada',
        quantity: 1,
        type: 'weapon',
      });
    }
    if (effects.hasGuarana) {
      addItemToInventory({
        id: 'guarana_jesus',
        name: 'Guaraná Jesus',
        quantity: 1,
        type: 'consumable',
        effect: { thirst: -30, stress: -20 },
      });
    }
  };

  const handleChoice = (choice) => {
    if (!checkRequirement(choice.requirements)) return;
    applyChoiceEffects(choice.effects);
    changeNode(choice.nextNodeId);
  };

  return (
    <div className="main-panel">
      <div className="dialogue-text">{displayedText}</div>
      <div className="choices-list">
        {textComplete &&
          node.choices.map((choice, i) => {
            const allowed = checkRequirement(choice.requirements);
            return (
              <button
                key={i}
                className="choice-button"
                disabled={!allowed}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
                {!allowed ? ' (Fichas insuficientes)' : ''}
              </button>
            );
          })}
        {textComplete && node.choices.length === 0 && (
          <p style={{ color: 'var(--color-phosphor-green-dim)', margin: 0 }}>
            — Transmissão encerrada —
          </p>
        )}
      </div>
    </div>
  );
}
