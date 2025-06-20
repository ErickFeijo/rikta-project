import React from 'react';
import './Card.css';

export default function Card({ card, showButton = false, onClick, compact = false }) {
  return (
    <div className={`card-container ${compact ? 'card-compact' : ''}`} title={card.description}>
      <div className="card-background" />
      <div className="card-content">
        <div>
          <div className="card-title">{card.name}</div>
          <div className="card-details">{card.description}</div>
        </div>
        {card.bonus && (
          <div className="card-bonus">+{card.bonus}</div>
        )}
        {showButton && (
          <button onClick={onClick}>Equipar</button>
        )}
      </div>
    </div>
  );
}
