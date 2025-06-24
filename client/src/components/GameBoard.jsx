// src/components/GameBoard.jsx
import React from 'react';
import './GameBoard.css';
import PlayerList from './PlayerList';
import EquipmentPanel from './EquipmentPanel';
import GameInfoHeader from './GameInfoHeader.jsx';
import DeckCard from './DeckCard';
import HandCardList from './HandCardList';
import BattleArea from './BattleArea';

export default function GameBoard({ playerName, gameState, onKickDoor, onEquipCard, onHelpPlayer, onHelpMonster }) {
  const isInitialSetup = gameState.phase === 'initialSetup';
  const currentTurnPlayer = gameState.players.find(p => p.isTurn)?.username;
  const currentPlayer = gameState.players.find(p => p.username === playerName);
  const isPlayerTurn = isInitialSetup || (playerName === currentTurnPlayer);
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
            {/* <BattleArea cardOpened={gameState.cardOpened} battleState={gameState.battleState} /> */}
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
