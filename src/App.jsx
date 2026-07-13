import React from 'react';
import CRTScreen from './components/CRTScreen';
import IntroBoot from './components/IntroBoot';
import StatGauge from './components/StatGauge';
import NarrativePanel from './components/NarrativePanel';
import CombatPanel from './components/CombatPanel';
import InventoryGrid from './components/InventoryGrid';
import { useGameStore } from './store/useGameStore';
import { nodes } from './data/nodes';

export default function App() {
  const introComplete = useGameStore((s) => s.introComplete);
  const player = useGameStore((s) => s.player);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const node = nodes[currentNodeId];

  if (!introComplete) {
    return (
      <CRTScreen fullBleed>
        <IntroBoot />
      </CRTScreen>
    );
  }

  return (
    <CRTScreen>
      <div className="sidebar-panel">
        <div className="sidebar-header">Wasteland Operator</div>

        <StatGauge label="Vida (HP)" value={player.health} max={player.maxHealth} />
        <StatGauge label="Stress" value={player.stress} max={100} />
        <StatGauge
          label="Radiação"
          value={player.radiation}
          max={100}
          isRad={true}
        />

        <div className="resource-list">
          <div>Fome: {player.hunger}%</div>
          <div>Sede: {player.thirst}%</div>
          <div>Fichas: {player.currency}</div>
          <div>Sucata: {player.scrap}</div>
          <div>Munição: {player.ammo}</div>
        </div>

        <InventoryGrid />
      </div>

      <div className="main-content-area">
        {node && node.type === 'narrative' && <NarrativePanel />}
        {node && node.type === 'combat' && <CombatPanel />}
      </div>
    </CRTScreen>
  );
}
