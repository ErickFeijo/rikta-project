// BattleArea/BattleCenter.jsx
import React from 'react';
import './BattleCenter.css'
import { socket } from '../socket';

export default function BattleCenter({
  gameState,
  mainPlayer,
  playerPower,
  monsterPower,
  isPlayerTurn,
  onResolveCombat,
  onAttemptFlee,
  resolveTimer
}) {
  const playerWinning = playerPower >= monsterPower;
  
  return (
    <div className="battle-center">
      {gameState.phase === "combat" && (
      <div className="battle-comparison">
        <div className={`score player-score ${playerWinning ? 'winner' : 'loser'}`}>
          <div className="score-label">{mainPlayer.username}</div>
          <div className="score-value">+{playerPower}</div>
        </div>

        <div className="versus-icon">⚔️</div>

        <div className={`score monster-score ${!playerWinning ? 'winner' : 'loser'}`}>
          <div className="score-label">Monstro</div>
          <div className="score-value">+{monsterPower}</div>
        </div>
      </div>
      )}

      <div className="game-hint">
        {gameState.hintMessage}
      </div>
      
      <div className="battle-actions">

      {gameState.phase === "combat" && isPlayerTurn && (
          <>
          <button
            className="battle-button"
            onClick={onResolveCombat}
            disabled={!isPlayerTurn || resolveTimer > 0}
          >
            ⚔️ Combater {resolveTimer > 0 ? `(${resolveTimer}s)` : ''}
          </button>
          <button
            className="battle-button flee-button"
            onClick={onAttemptFlee}
            disabled={!isPlayerTurn}
          >
            🏃‍♂️ Fugir
          </button>
          </>
       )}

        {gameState.phase === 'initialSetup' && (
          <button
            className="battle-button"
            disabled={gameState.hasFinishedSetup}
            onClick={() => socket.emit('finish_setup')}
          >
            Finalizar Setup
          </button>
        )}

        </div>
    </div>
  );
}
