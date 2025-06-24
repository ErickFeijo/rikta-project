// BattleArea/MonsterSide.jsx
import React from 'react';
import CardStack from './CardStack';
import Card from './Card';
import './PlayerSide.css';

export default function MonsterSide({ monsterCard, monsterPower, isPlayerTurn, onHelpMonster }) {
  if (!monsterCard) return null;

  return (
    <>
      {!isPlayerTurn && (
        <div className="side-button-wrapper">
          <button className="help-button" onClick={onHelpMonster}>
            😈 Ajudar Monstro
          </button>
        </div>
      )}
      <div className="side-holder">
        <div className="holder-label">{monsterCard.name}</div>
        <CardStack cards={[monsterCard]} />
        <div className="total-label">
          Bônus: <span className="bonus-value">+{monsterPower}</span>
        </div>
      </div>
    </>
  );
}
