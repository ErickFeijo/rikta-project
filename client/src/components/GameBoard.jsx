import React from 'react';
import './GameBoard.css';
import DeckCard from './DeckCard';

export default function GameBoard({ playerName, gameState, onKickDoor }) {
  const currentTurnPlayer = gameState.players.find(p => p.isTurn)?.username;
  const isPlayerTurn = playerName === currentTurnPlayer;
  const currentPlayer = gameState.players.find(p => p.username === playerName);
  const handCards = currentPlayer?.hand || [];

  return (
    <div className="gameboard-container">
      <aside className="sidebar">
        <h2>Jogadores</h2>
        <ul>
          {gameState.players.map(p => (
            <li key={p.id}>
              <strong>{p.username}{p.isHost && ' ⭐'}</strong> — Nível <strong>{p.level}</strong>
              {p.isTurn && ' 🎯'}
            </li>
          ))}
        </ul>

      </aside>

      <div className="equipment-tab">
        <input type="checkbox" id="toggle-equipment" className="toggle-equipment" />
        <label htmlFor="toggle-equipment" className="equipment-label">⚙️ Equipamentos</label>
        
     <div className="equipment-panel">
        <h3>Equipamentos</h3>
        <div className="equipment-layout">
          <div className="hand-slot left-hand">
            <div className="equipment-slot">🖐️ Mão Esq.</div>
          </div>

          <div className="body-slots">
            <div className="equipment-slot"><span className="equipment-icon">🪖</span> Elmo</div>
            <div className="equipment-slot"><span className="equipment-icon">🦺</span> Armadura</div>
            <div className="equipment-slot"><span className="equipment-icon">🥾</span> Botas</div>
          </div>

          <div className="hand-slot right-hand">
            <div className="equipment-slot">✋ Mão Dir.</div>
          </div>
        </div>
      </div>

      </div>
 
    <div className="main-content">
      
      <main className="main-board">
        <header className="gameboard-header">
          {/* <h1>Munchkin Online - Sala: {gameState.room}</h1> */}
          <div className="info-panel">
            <div className="info-box phase">🛠️ <span>Fase:</span> <strong>{gameState.phase}</strong></div>
            <div className="info-box current-player">🎯 <span>Jogador atual:</span> <strong>{currentTurnPlayer}</strong></div>
          </div>
        </header>

        <section className="middle-area">
          <div className="battle-setup-placeholder">
            {/* Aqui vão os setups de jogadores */}
          </div>
          <div className="divider" />
          <div className="battle-setup-placeholder">
            {/* Aqui vão os setups de jogadores */}
          </div>
          <div className="deck-area">
              <DeckCard
                type="door"
                isClickable={isPlayerTurn && gameState.phase === 'kickDoor'}
                onClick={() => isPlayerTurn && gameState.phase === 'kickDoor' && onKickDoor()}
              />

              <DeckCard type="treasure" />
          </div>
        </section>
        
      </main>
      <section className="hand-cards">
        <div className="hand-left">
          {handCards.length === 0 && <p>Você ainda não tem cartas.</p>}
          {handCards.map(card => (
            <div key={card.id} className="card" title={card.description}>
              <h4>{card.name}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
        <div className="hand-right">
          <button
            className="finish-turn-btn"
            disabled={!isPlayerTurn}
            onClick={() => alert('Turno finalizado')}
          >
            Finalizar Turno
          </button>
        </div>
      </section>
     </div>
     
    </div>
  );
}
