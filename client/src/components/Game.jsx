import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Game({ room, username }) {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('game_state', (state) => {
      setGameState(state);
    });

    // pedir o estado inicial se o usuário entrou no meio do jogo
    socket.emit('get_game_state', { room });

    return () => {
      socket.off('game_state');
    };
  }, [room]);

  if (!gameState) return <p>Carregando estado do jogo...</p>;

  return (
    <GameBoard
      playerName={username}
      gameState={gameState}
    />
  );
}
