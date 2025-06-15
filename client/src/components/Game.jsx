import React from 'react';
import GameBoard from './GameBoard';

export default function Game({ room, username }) {
  // Mock: o jogador atual é sempre o primeiro (no futuro vai ser do backend)
  const currentTurnPlayer = username;

  return <GameBoard playerName={username} currentTurnPlayer={currentTurnPlayer} room={room} />;
}
