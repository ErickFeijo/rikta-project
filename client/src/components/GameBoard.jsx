// src/components/GameBoard.jsx
import React from 'react';
import './GameBoard.css';
import PlayerList from './PlayerList';
import EquipmentPanel from './EquipmentPanel';
import GameInfoHeader from './GameInfoHeader.jsx';
import DeckCard from './DeckCard';
import HandCardList from './HandCardList';
import BattleArea from './BattleArea';

export default function GameBoard({ playerName, gameState, onKickDoor, onEquipCard }) {
  const currentTurnPlayer = gameState.players.find(p => p.isTurn)?.username;
  const isPlayerTurn = playerName === currentTurnPlayer;
  const currentPlayer = gameState.players.find(p => p.username === playerName);
  const handCards = currentPlayer?.hand || [];
  const equipment = currentPlayer?.equipment || {};

  return (
    <div className="gameboard-container">
      <PlayerList players={gameState.players} />

      <EquipmentPanel equipment={equipment} />

      <div className="main-content">
        <main className="main-board">
          <GameInfoHeader currentPlayer={currentTurnPlayer} phase={gameState.phase} />
          <section className="middle-area">
            <BattleArea cardOpened={gameState.cardOpened} battleState={gameState.battleState} />

            <DeckCard
              type="door"
              isClickable={isPlayerTurn && gameState.phase === 'setup'}
              onClick={onKickDoor}
            />
          </section>
        </main>
        <HandCardList
          cards={handCards}
          isPlayerTurn={isPlayerTurn}
          phase={gameState.phase}
          onEquipCard={onEquipCard}
        />
      </div>
    </div>
  );
}
