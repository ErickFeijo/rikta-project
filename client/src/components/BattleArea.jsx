import React, { useState } from 'react';
import './BattleArea.css';
import Card from './Card';

export default function BattleArea({ cardOpened, battleState }) {
  const [showPlayerCards, setShowPlayerCards] = useState(false);

  const handleToggle = () => setShowPlayerCards(!showPlayerCards);

  return (
    <div className="battle-area">
      <div className="battle-side player-side">
        {battleState && (
          <div className="side-holder">
            <div className="holder-label">{battleState.mainPlayerName}</div>
            <div className="card-stack" onClick={handleToggle}>
              {battleState.equippedCards.map((c, i) => (
                <div
                  key={c.id}
                  className="card-stack-item"
                  style={{ top: 0, left: `${i * 18}px`, zIndex: i }}
                >
                  <Card card={c} compact={true} />
                </div>
              ))}
            </div>
            <div className="total-label">Total: {battleState.playerPower}</div>
          </div>
        )}
      </div>

      <div className="battle-center">
        {cardOpened ? <Card key={cardOpened.id} card={cardOpened} /> : <div></div>}
      </div>

      <div className="battle-side enemy-side">
        {battleState?.monsterCard && (
          <div className="side-holder">
            <div className="holder-label">{battleState.monsterCard.name}</div>
            <div className="card-stack">
              <div className="card-stack-item">
                <Card card={battleState.monsterCard} compact={true} />
              </div>
            </div>
            <div className="total-label">Total: {battleState.monsterPower}</div>
          </div>
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
