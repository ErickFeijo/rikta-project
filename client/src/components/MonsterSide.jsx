// BattleArea/MonsterSide.jsx
import React from 'react';
import CardStack from './CardStack';
import './PlayerSide.css';

export default function MonsterSide({ monsterCards = [] }) {
  if (!monsterCards.length) return null;

  return (
    <>
      <div className="player-side-content">
      {monsterCards.map((monster, index) => (
        <div key={monster.id || index} className="side-holder">
          <div className="holder-label">{monster.name}</div>
          <CardStack cards={[monster]} />

          <div className="added-by-label">
            {monster.addedBy && (
             <span>({monster.addedBy.username})</span>
             )}
          </div>

          <div className="total-label">
            Bônus: <span className="bonus-value">+{monster.bonus}</span>
          </div>
          
        </div>
      ))}
      </div>
    </>
  );
}
