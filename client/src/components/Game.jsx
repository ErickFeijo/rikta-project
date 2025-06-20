// components/Game.js
import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import { socket } from '../socket';

export default function Game({ room, username }) {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.emit('joinRoom', { room, username });

    socket.on('game_state', (state) => {
      setGameState(state);
    });

    socket.on('errorMessage', (msg) => {
      alert(msg);
    });

    socket.emit('get_game_state', { room });

    return () => {
      socket.off('game_state');
      socket.off('errorMessage');
    };
  }, [room, username]);

  const handleKickDoor = () => {
    socket.emit('kickDoor');
  };

  const handleEquipCard = (cardId) => {
    socket.emit('equip_card', { cardId });
  };

  if (!gameState) return <p>Carregando estado do jogo...</p>;

  return (
    <GameBoard
      playerName={username}
      gameState={gameState}
      onKickDoor={handleKickDoor}
      onEquipCard={handleEquipCard}
    />
  );
}
