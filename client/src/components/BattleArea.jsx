import React, { useState } from 'react';
import './BattleArea.css';
import Card from './Card';

import { useEffect } from 'react';
import { socket } from '../socket'; // ajuste o path se necessário

export default function BattleArea({ cardOpened, battleState, onHelpPlayer, onHelpMonster, isPlayerTurn }) {
  const [showPlayerCards, setShowPlayerCards] = useState(false);
  const [resolveTimer, setResolveTimer] = useState(0);
  const handleToggle = () => setShowPlayerCards(!showPlayerCards);

  const isResolveDisabled = resolveTimer > 0;

  const playerWinning = battleState?.playerPower >= battleState?.monsterPower;

  useEffect(() => {
    if (
      isPlayerTurn &&
      battleState?.playerPower > battleState?.monsterPower
    ) {
      setResolveTimer(30);
    }
  }, [battleState?.monsterCard?.id]); // reinicia timer ao puxar novo monstro

  useEffect(() => {
    if (resolveTimer <= 0) return;
    const interval = setInterval(() => {
      setResolveTimer((prev) => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resolveTimer]);


  return (
    <div className="battle-area">
      {/* Lado do jogador */}
      <div className="battle-side player-side">
        {battleState && (
          <>
         {!isPlayerTurn && (
          <div className="side-button-wrapper">
            <button
              className="help-button"
              onClick={() => onHelpPlayer && onHelpPlayer(battleState.mainPlayerId)}
            >
              🙌 Ajudar {battleState.mainPlayerName}
            </button>
          </div>
        )}


       <div className="side-holder">
          <div className="holder-label">{battleState.mainPlayer.username}</div>
          <div className="card-stack" onClick={handleToggle}>
            {battleState.mainPlayer.equippedCards.map((c, i) => (
              <div
                key={c.id}
                className="card-stack-item"
                style={{ top: 0, left: `${i * 18}px`, zIndex: i }}
              >
                <Card card={c} compact={true} />
              </div>
            ))}
          </div>
          <div className="total-label">
            Bônus: <span className="bonus-value">+{battleState.mainPlayer.power}</span>
          </div>
        </div>

        {battleState.helperPlayer && (
          <div className="side-holder">
            <div className="holder-label">{battleState.helperPlayer.username} (Ajudante)</div>
            <div className="card-stack">
              {battleState.helperPlayer.equippedCards.map((c, i) => (
                <div
                  key={c.id}
                  className="card-stack-item"
                  style={{ top: 0, left: `${i * 18}px`, zIndex: i }}
                >
                  <Card card={c} compact={true} />
                </div>
              ))}
            </div>
            <div className="total-label">
              Bônus: <span className="bonus-value">+{battleState.helperPlayer.power}</span>
            </div>
          </div>
        )}

          </>
        )}
      </div>

      {/* Centro */}
      <div className="battle-center">
        {battleState && (
          <div className="battle-comparison">
         <div className={`score player-score ${playerWinning ? 'winner' : 'loser'}`}>
          <div className="score-value">
              {battleState.playerPower > 0 ? '+' : ''}
              {battleState.playerPower}
            </div>
            <div className="score-label">{battleState.mainPlayerName}</div>
          </div>
          
          <div className="versus-icon">⚔️</div>

          <div className={`score monster-score ${!playerWinning ? 'winner' : 'loser'}`}>
            <div className="score-value">
              {battleState.monsterPower > 0 ? '+' : ''}
              {battleState.monsterPower}
            </div>
            <div className="score-label">{battleState.monsterCard?.name}</div>
          </div>
          </div>
        )}

        {cardOpened ? <Card key={cardOpened.id} card={cardOpened} /> : <div></div>}

         <div className="battle-actions">
          <button
            className="battle-button"
            onClick={() => socket.emit('resolve_combat')}
            disabled={
              !isPlayerTurn ||
              // battleState.playerPower <= battleState.monsterPower ||
              isResolveDisabled
            }
          >
            ⚔️ Combater {resolveTimer > 0 ? `(${resolveTimer}s)` : ''}
          </button>
         
          {/* {resolveTimer > 0 && (
              <div className="combat-timer-overlay">
                {resolveTimer}s
              </div>
            )} */}
          <button
            className="battle-button flee-button"
            onClick={() => socket.emit('attempt_flee')}
            disabled={!isPlayerTurn}
          >
            🏃‍♂️ Fugir
          </button>
        </div>
      </div>



      {/* Lado do monstro */}
      <div className="battle-side enemy-side">
        {battleState?.monsterCard && (
          <>
            {!isPlayerTurn && (
              <div className="side-button-wrapper">
                <button
                  className="help-button"
                  onClick={() => onHelpMonster && onHelpMonster()}
                >
                  😈 Ajudar Monstro
                </button>
              </div>
            )}
            <div className="side-holder">
              <div className="holder-label">{battleState.monsterCard.name}</div>
              <div className="card-stack">
                <div className="card-stack-item">
                  <Card card={battleState.monsterCard} compact={true} />
                </div>
              </div>
              <div className="total-label">
                Bônus: <span className="bonus-value">+{battleState.monsterPower}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {showPlayerCards && (
        <div className="card-detail-box">
          <div className="card-detail-header">
            <span>Cartas de {battleState.mainPlayerName}</span>
            <button onClick={() => setShowPlayerCards(false)}>Fechar</button>
          </div>
          <div className="card-list">
            {battleState.equippedCards.map(card => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
