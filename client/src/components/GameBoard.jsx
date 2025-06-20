import React from 'react';
import './GameBoard.css';
import DeckCard from './DeckCard';
import Card from './Card';

export default function GameBoard({ playerName, gameState, onKickDoor, onEquipCard }) {
  const currentTurnPlayer = gameState.players.find(p => p.isTurn)?.username;
  const isPlayerTurn = playerName === currentTurnPlayer;
  const currentPlayer = gameState.players.find(p => p.username === playerName);
  const handCards = currentPlayer?.hand || [];
  const equipment = currentPlayer?.equipment || {};

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
              <div className="equipment-slot">
                {equipment.leftHand
                  ? <Card card={equipment.leftHand} compact />
                  : <>🖐️ Mão Esq.</>}
              </div>
            </div>

            <div className="body-slots">
              <div className="equipment-slot">
                {equipment.head
                  ? <Card card={equipment.head} compact />
                  : <>🪖 Elmo</>}
              </div>
              <div className="equipment-slot">
                {equipment.body
                  ? <Card card={equipment.body} compact />
                  : <>🦺 Armadura</>}
              </div>
              <div className="equipment-slot">
                {equipment.feet
                  ? <Card card={equipment.feet} compact />
                  : <>🥾 Botas</>}
              </div>
            </div>

            <div className="hand-slot right-hand">
              <div className="equipment-slot">
                {equipment.rightHand
                  ? <Card card={equipment.rightHand} compact />
                  : <>✋ Mão Dir.</>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <main className="main-board">
          <header className="gameboard-header">
            <div className="info-panel">
              <div className="info-box phase">🛠️ <span>Fase:</span> <strong>{gameState.phase}</strong></div>
              <div className="info-box current-player">🎯 <span>Jogador atual:</span> <strong>{currentTurnPlayer}</strong></div>
            </div>
          </header>

          <section className="middle-area">
            <div className="battle-setup-placeholder" />
            <div className="divider" />
            <div className="battle-setup-placeholder" />
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
              <Card
                key={card.id}
                card={card}
                showButton={card.type === 'equipment' && isPlayerTurn && gameState.phase === 'setup'}
                onClick={() => onEquipCard(card.id)}
              />
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
