import React from 'react';
import './DeckCard.css';
import Card from './Card'; // certifique-se que o caminho está correto

export default function DeckCard({ cardOpened, type, onClick, isClickable }) {
  const imageSrc = type === 'treasure'
    ? '/assets/back-treasure.png'
    : '/assets/back-door.png';

  return (
    <div className="deck-wrapper">
      <div
        className={`deck-card ${isClickable ? 'clickable' : 'disabled'}`}
        onClick={isClickable ? onClick : undefined}
        title={type === 'treasure' ? 'Tesouro' : 'Porta'}
      >
        <img src={imageSrc} alt={`Carta de ${type}`} />
      </div>

      {cardOpened && (
        <div className="deck-opened-card">
          <Card key={cardOpened.id} card={cardOpened} />
        </div>
      )}
    </div>
  );
}
