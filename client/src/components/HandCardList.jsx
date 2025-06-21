import React from 'react';
import Card from './Card';

export default function HandCardList({ cards, isPlayerTurn, phase, onEquipCard }) {
  return (
    <section className="hand-cards">
      <div className="hand-left">
        {cards.length === 0 && <p>Você ainda não tem cartas.</p>}
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            showButton={card.type === 'equipment' && isPlayerTurn && phase === 'setup'}
            onClick={() => onEquipCard(card.id)}
          />
        ))}
      </div>
      <div className="hand-right">
        <button
          className="finish-turn-btn"
          disabled={!isPlayerTurn}
          onClick={() => alert('Turno finalizado')}
          aria-label="Finalizar turno"
        >
          Finalizar Turno
        </button>
      </div>
    </section>
  );
}
