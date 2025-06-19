import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Game({ room, username }) {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // Ao entrar, avisa o servidor que entrou na sala
    socket.emit('joinRoom', { room, username });

    socket.on('game_state', (state) => {
      setGameState(state);
    });

    socket.on('errorMessage', (msg) => {
      alert(msg);
    });

    // Se o jogador entrar no meio do jogo, pode pedir o estado atual
    socket.emit('get_game_state', { room });

    return () => {
      socket.off('game_state');
      socket.off('errorMessage');
    };
  }, [room, username]);

  const handleKickDoor = () => {
    socket.emit('kickDoor');
  };

  if (!gameState) return <p>Carregando estado do jogo...</p>;

  return (
    <GameBoard
      playerName={username}
      gameState={gameState}
      onKickDoor={handleKickDoor}
    />
  );
}
