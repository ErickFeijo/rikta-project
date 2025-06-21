import React from 'react';

export default function GameInfoHeader({ currentPlayer, phase }) {
  return (
    <header className="gameboard-header">
      <div className="info-panel">
        <div className="info-box phase">🛠️ <span>Fase:</span> <strong>{phase}</strong></div>
        <div className="info-box current-player">🎯 <span>Jogador atual:</span> <strong>{currentPlayer}</strong></div>
      </div>
    </header>
  );
}