import React from 'react';
import { useGameStore } from '../store/useGameStore';

export default function InventoryGrid() {
  // Alias: oxlint treats names starting with "use" as React hooks
  const inventory = useGameStore((s) => s.inventory);
  const consumeItem = useGameStore((s) => s.useItem);

  return (
    <div className="inventory-container">
      <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>Inventário</h4>
      <div className="inventory-grid">
        {inventory.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="inventory-item">
            <span>
              {item.name} x{item.quantity}
            </span>
            {item.type === 'consumable' && (
              <button
                className="inventory-use-btn"
                onClick={() => consumeItem(item.id)}
              >
                Usar
              </button>
            )}
          </div>
        ))}
        {inventory.length === 0 && <span className="inventory-empty">Vazio</span>}
      </div>
    </div>
  );
}
