// BattleArea/BattleArea.jsx
import React, { useState, useEffect } from 'react';
import './BattleArea.css';
import PlayerSide from './PlayerSide';
import MonsterSide from './MonsterSide';
import BattleCenter from './BattleCenter';
import { socket } from '../socket';
import './BattleArea.css';

export default function BattleArea({
  gameState,
  battleState,
  onHelpPlayer,
  onHelpMonster,
  isPlayerTurn
}) {
  const [showPlayerCards, setShowPlayerCards] = useState(false);
  const [resolveTimer, setResolveTimer] = useState(0);

  useEffect(() => {
    if (isPlayerTurn && battleState?.playerPower > battleState?.monsterPower) {
      setResolveTimer(30);
    }
  }, [battleState?.monsterCard?.id]);

  useEffect(() => {
    if (resolveTimer <= 0) return;
    const interval = setInterval(() => {
      setResolveTimer(prev => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resolveTimer]);

  if (!battleState) return null;

  return (
    <div className="battle-area">
      <div className="battle-side player-side">
        <PlayerSide
          mainPlayer={battleState.mainPlayer}
          helperPlayer={battleState.helperPlayer}
          isPlayerTurn={isPlayerTurn}
          onHelp={() => onHelpPlayer && onHelpPlayer(battleState.mainPlayer.id)}
        />
      </div>

      <BattleCenter
        gameState={gameState}
        mainPlayer={battleState.mainPlayer}
        playerPower={battleState.playerPower}
        monsterPower={battleState.monsterPower}
        monsterCard={battleState.monsterCard}
        isPlayerTurn={isPlayerTurn}
        resolveTimer={resolveTimer}
        onResolveCombat={() => socket.emit('resolve_combat')}
        onAttemptFlee={() => socket.emit('attempt_flee')}
      />

      <div className="battle-side enemy-side">
        <MonsterSide
          monsterCard={battleState.monsterCard}
          monsterPower={battleState.monsterPower}
          isPlayerTurn={isPlayerTurn}
          onHelpMonster={onHelpMonster}
        />
      </div>

      {showPlayerCards && (
        <div className="card-detail-box">
          <div className="card-detail-header">
            <span>Cartas de {battleState.mainPlayer.username}</span>
            <button onClick={() => setShowPlayerCards(false)}>Fechar</button>
          </div>
          <div className="card-list">
            {battleState.mainPlayer.equippedCards.map(card => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
