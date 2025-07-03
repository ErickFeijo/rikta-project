import React, { useState } from 'react';
import './HandCardList.css';
import Card from './Card';
import CardActionMenu from './CardActionMenu';

export default function HandCardList({ cards, isPlayerTurn, phase }) {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="hand-cards">
      {cards.length === 0 && <p>Você ainda não tem cartas.</p>}
      {cards.map((card, index) => {
        const total = cards.length;
        const angle = (index - (total - 1) / 2) * 2;

        return (
          <div
            key={card.id}
            className="card"
            style={{ transform: `rotate(${angle}deg)`, position: 'relative' }}
            onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
          >
            <Card card={card} showButton={false} />
            {selectedCard?.id === card.id && (
              <CardActionMenu
                card={card}
                isPlayerTurn={isPlayerTurn}
                phase={phase}
                onClose={() => setSelectedCard(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
