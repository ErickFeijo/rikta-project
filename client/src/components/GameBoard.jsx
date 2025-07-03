// src/components/GameBoard.jsx
import React from 'react';
import './GameBoard.css';
import PlayerList from './Sidebar.jsx';
import EquipmentPanel from './EquipmentPanel';
import GameInfoHeader from './GameInfoHeader.jsx';
import DeckCard from './DeckCard';
import HandCardList from './HandCardList';
import BattleArea from './BattleArea';
import Sidebar from './Sidebar.jsx';

export default function GameBoard({ playerName, gameState, onKickDoor, onHelpPlayer, onHelpMonster }) {
  const isInitialSetup = gameState.phase === 'initialSetup';
  const currentTurnPlayer = gameState.players.find(p => p.isTurn)?.username;
  const currentPlayer = gameState.players.find(p => p.username === playerName);
  const isPlayerTurn = isInitialSetup || (playerName === currentTurnPlayer);
  const handCards = gameState?.hand || [];
  const equipment = currentPlayer?.equipment || {};

  return (
    <div className="gameboard-container">
      <Sidebar players={gameState.players} playerName={playerName} />

      <EquipmentPanel equipment={equipment} />

      <div className="main-content">
        <main className="main-board">
          <GameInfoHeader currentPlayer={currentTurnPlayer} phase={gameState.phase} />
          <section className="middle-area">
            
            <BattleArea
              cardOpened={gameState.cardOpened}
              gameState={gameState}
              battleState={gameState.battleState}
              onHelpPlayer={onHelpPlayer}
              onHelpMonster={onHelpMonster}
              isPlayerTurn={isPlayerTurn}
            />

            <DeckCard
              cardOpened={gameState.cardOpened}
              type="door"
              isClickable={isPlayerTurn && gameState.phase === 'setup'}
              onClick={onKickDoor}
            />
          </section>

          <HandCardList
            cards={handCards}
            isPlayerTurn={isPlayerTurn}
            phase={gameState.phase}
          />
        </main>
      
      </div>
    </div>
  );
}
