// BattleArea/CardStack.jsx
import React from 'react';
import Card from './Card';
import './CardStack.css';

export default function CardStack({ cards, onClick }) {
  return (
    <div className="card-stack" onClick={onClick}>
      {cards.map((c, i) => (
        <div
          key={c.id}
          className="card-stack-item"
          style={{ top: 0, left: `${i * 18}px`, zIndex: i }}
        >
          <Card card={c} compact={true} />
        </div>
      ))}
    </div>
  );
}
