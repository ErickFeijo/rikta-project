import React from 'react';
import './DeckCard.css';

export default function DeckCard({ type, onClick, isClickable }) {
  const imageSrc = type === 'treasure'
    ? '/assets/back-treasure.png'
    : '/assets/back-door.png';

  return (
    <div
      className={`deck-card ${isClickable ? 'clickable' : 'disabled'}`}
      onClick={isClickable ? onClick : undefined}
      title={type === 'treasure' ? 'Tesouro' : 'Porta'}
    >
      <img src={imageSrc} alt={`Carta de ${type}`} />
    </div>
  );
}
