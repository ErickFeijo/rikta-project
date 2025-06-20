// hooks/useSocket.js
import { useEffect, useState } from 'react';
import { socket } from '../socket';

export function useSocket() {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.on('room_users', setPlayers);
    socket.on('game_started', () => setGameStarted(true));
    socket.on('error_message', (msg) => alert(msg));

    return () => {
      socket.off('room_users');
      socket.off('game_started');
      socket.off('error_message');
    };
  }, []);

  const joinRoom = ({ username, room }) => {
    socket.emit('join_room', { username, room });

    setTimeout(() => {
      socket.emit('room_users');
    }, 200);
  };

  const startGame = () => {
    socket.emit('start_game');
  };

  return { players, gameStarted, joinRoom, startGame };
}
