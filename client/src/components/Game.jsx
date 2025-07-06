// components/Game.js
import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import FleeAttemptResult from './FleeAttemptResult';
import TurnTransition from './TurnTransition';
import BattleResult from './BattleResult';
import { socket } from '../socket';

export default function Game({ room, username }) {
  const [gameState, setGameState] = useState(null);
  const [fleeResult, setFleeResult] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [nextPlayerName, setNextPlayerName] = useState(null);

  useEffect(() => {
    socket.emit('joinRoom', { room, username });

    socket.on('game_state', (state) => {
      setGameState(state);
    });

    socket.on('state_updated', () => {
      socket.emit('get_game_state', { room });
    });

    socket.on('errorMessage', (msg) => { 
      alert(msg);
    });
    
    socket.on('flee_attempted', ({ result }) => {
      setFleeResult(result);
    });

    socket.on('battle_result', ({ result }) => {
      setBattleResult(result);
    });

    socket.emit('get_game_state', { room });

    return () => {
      socket.off('game_state');
      socket.off('flee_attempted');
      socket.off('state_updated');
      socket.off('errorMessage');
      socket.off('battle_result');
    };
  }, [room, username]);

  const handleKickDoor = () => {
    socket.emit('kickDoor');
  };

  const handleRefreshGameState = () => {
    socket.emit('get_game_state', { room });
  };

  if (!gameState) return <p>Carregando estado do jogo...</p>;

  return (
    <>
     <button
        onClick={handleRefreshGameState}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 14px',
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        🔄 Atualizar
      </button>
      <button
        onClick={() => socket.emit('restart_game')}
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '20px',
          padding: '10px 14px',
          backgroundColor: '#c0392b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        🔁 Reiniciar Jogo
      </button>

      <GameBoard
        playerName={username}
        gameState={gameState}
        onKickDoor={handleKickDoor}
      />

     {fleeResult && (
        <FleeAttemptResult
          playerName={username}
          gameState={gameState}
          result={fleeResult.data}
          onClose={() => {
            setFleeResult(null);
            // Agora sim, ao sumir, mostra a transição de turno
            if (fleeResult.data?.nextPlayer?.username) {
              setNextPlayerName(fleeResult.data.nextPlayer.username);
              handleRefreshGameState();
            }
          }}
        />
      )}

      {battleResult && (
        <BattleResult
          playerName={username}
          result={battleResult}
          onClose={() => {
            setBattleResult(null);
            if (battleResult.data?.nextPlayer?.username) {
              setNextPlayerName(battleResult.data.nextPlayer.username);
              handleRefreshGameState();
            }
          }}
        />
      )}

      {nextPlayerName && (
        <TurnTransition
          playerName={nextPlayerName}
          onFinish={() => setNextPlayerName(null)}
        />
       )}

    </>
  );
}
