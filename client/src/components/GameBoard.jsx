import React from 'react';
import './GameBoard.css';

export default function GameBoard({ playerName, gameState }) {
  const currentTurnPlayer = gameState.players.find(p => p.isTurn)?.username;

  const isPlayerTurn = playerName === currentTurnPlayer;

  const currentPlayer = gameState.players.find(p => p.username === playerName);
  const handCards = currentPlayer?.hand || [];

  const tableCards = gameState.tableCards || []; // quando tiver cards ativos em jogo

  return (
    <div className="gameboard-container">
      <header className="gameboard-header">
        <h1>Munchkin Online - Sala: {gameState.room}</h1>
        <div className="info">
          <div>Jogador atual: <strong>{currentTurnPlayer}</strong></div>
          <div>Você: <strong>{playerName}</strong></div>
        </div>
      </header>

      <section className="players-status" aria-label="Status dos jogadores">
        <h3>Jogadores:</h3>
        <ul>
          {gameState.players.map(p => (
            <li key={p.id}>
              {p.username} - Nível: {p.level} {p.isTurn ? '🎯 (Turno)' : ''}
              {p.isHost ? ' ⭐ (Host)' : ''}
            </li>
          ))}
        </ul>
      </section>

      <section className="table-cards" aria-label="Cartas na mesa">
        <h3>Mesa:</h3>
        {tableCards.length === 0 && <p>Nenhuma carta na mesa ainda.</p>}
        {tableCards.map((card) => (
          <div key={card.id} className="card" title={card.description}>
            <h4>{card.name}</h4>
            <p>{card.description}</p>
          </div>
        ))}
      </section>

      <section className="hand-cards" aria-label="Sua mão de cartas">
        <h3>Sua mão:</h3>
        {handCards.length === 0 && <p>Você ainda não tem cartas.</p>}
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
