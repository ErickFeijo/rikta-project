import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Lobby from './components/Lobby';
import Game from './components/Game';
import { useSocket } from './hooks/useSocket';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [connected, setConnected] = useState(false);

  const { players, gameStarted, joinRoom, startGame } = useSocket();

  const handleJoin = () => {
    if (!username || !room) return;
    joinRoom({ username, room });
    setConnected(true);
  };

  const isHost = players.length > 0 && players[0].name === username;

  if (!connected) {
    return (
      <LoginForm
        username={username}
        setUsername={setUsername}
        room={room}
        setRoom={setRoom}
        onJoin={handleJoin}
      />
    );
  }

  if (gameStarted) {
    return <Game room={room} username={username} />;
  }


  return (
    <Lobby room={room} players={players} isHost={isHost} onStartGame={startGame} />
  );
}

export default App;
