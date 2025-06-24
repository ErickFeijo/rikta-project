import React from 'react';
import './HandCardList.css';
import Card from './Card';

import { socket } from '../socket'; // ajuste o path se necessário

export default function HandCardList({ cards, isPlayerTurn, phase, onEquipCard }) {
  return (
    <div className="hand-cards">
    {/* // <section className="hand-cards"> */}
        {cards.length === 0 && <p>Você ainda não tem cartas.</p>}
        {cards.map((card, index) => {
          const total = cards.length;
          const angle = (index - (total - 1) / 2) * 2; // curva suave

          return (
            <div
              key={card.id}
              className="card"
              style={{ transform: `rotate(${angle}deg)` }}
              onClick={() => onEquipCard(card.id)}
            >
              <Card card={card} showButton={false} />
            </div>
          );
        })}

    {/* // </section> */}
    </div>
  );
}
