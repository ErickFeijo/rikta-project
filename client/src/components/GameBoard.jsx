import React from 'react';
import './GameBoard.css';

export default function GameBoard({ playerName, currentTurnPlayer, room }) {
  const handCards = [
    { id: 1, name: 'Espada Enferrujada', description: 'Arma fraca' },
    { id: 2, name: 'Cota de Malha', description: 'Proteção básica' },
    { id: 3, name: 'Poção de Cura', description: 'Recupera vida' },
  ];

  const tableCards = [
    { id: 101, name: 'Dragão', description: 'Monstro forte' },
    { id: 102, name: 'Mago', description: 'Aliado poderoso' },
  ];

  const isPlayerTurn = playerName === currentTurnPlayer;

  return (
    <div className="gameboard-container">
      <header className="gameboard-header">
        <h1>Munchkin Online - Sala: {room}</h1>
        <div className="info">
          <div>Jogador atual: <strong>{currentTurnPlayer}</strong></div>
          <div>Você: <strong>{playerName}</strong></div>
        </div>
      </header>

      <section className="table-cards" aria-label="Cartas na mesa">
        {tableCards.map((card) => (
          <div key={card.id} className="card" title={card.description}>
            <h4>{card.name}</h4>
            <p>{card.description}</p>
          </div>
        ))}
      </section>

      <section className="hand-cards" aria-label="Sua mão de cartas">
        {handCards.map((card) => (
          <div key={card.id} className="card" title={card.description}>
            <h4>{card.name}</h4>
            <p>{card.description}</p>
          </div>
        ))}
      </section>

      <button
        className="finish-turn-btn"
        disabled={!isPlayerTurn}
        onClick={() => alert('Turno finalizado (mockup)')}
      >
        Finalizar Turno
      </button>
    </div>
  );
}
