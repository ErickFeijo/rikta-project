import React from 'react';
import './HandCardList.css';
import Card from './Card';

import { socket } from '../socket'; // ajuste o path se necessário

export default function HandCardList({ cards, isPlayerTurn, phase, onEquipCard }) {
  return (
    <section className="hand-cards">
      <div className="hand-left">
        {cards.length === 0 && <p>Você ainda não tem cartas.</p>}
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            showButton={card.type === 'equipment' && isPlayerTurn && ['initialSetup', 'setup'].includes(phase)}
            onClick={() => onEquipCard(card.id)}
          />
        ))}
      </div>
      <div className="hand-right">
        {phase === 'initialSetup' ? (
          <button
            className="finish-turn-btn"
            disabled={!isPlayerTurn}
            onClick={() => socket.emit('finish_setup')}
          >
            Finalizar Setup
          </button>
        ) : (
          <button
            className="finish-turn-btn"
            disabled={!isPlayerTurn}
            onClick={() => alert('Turno finalizado')}
          >
            Finalizar Turno
          </button>
        )}
      </div>
    </section>
  );
}
