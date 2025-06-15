import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.on('room_users', (users) => {
      setPlayers(users);
    });

    socket.on('game_started', () => {
      setGameStarted(true);
    });

    socket.on('error_message', (msg) => {
      alert(msg);
    });
  }, []);

  const handleJoin = () => {
    if (!username || !room) return;
    socket.emit('join_room', { username, room });
    setConnected(true);
  };

  const handleStartGame = () => {
    socket.emit('start_game');
  };

  const isHost = players.length > 0 && players[0] === username;

  if (!connected) {
    return (
      <div className="p-4 font-sans text-white bg-gray-900 h-screen">
        <h1 className="text-2xl mb-4">Munchkin Online - Entrar em uma Sala</h1>
        <input
          className="p-2 rounded text-black block mb-2"
          type="text"
          placeholder="Seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="p-2 rounded text-black block mb-2"
          type="text"
          placeholder="Nome da sala"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button className="bg-green-600 px-4 py-2 rounded" onClick={handleJoin}>
          Entrar na Sala
        </button>
      </div>
    );
  }

  if (gameStarted) {
    return (
      <div className="p-4 font-sans text-white bg-gray-900 h-screen">
        <h2 className="text-3xl mb-4">Jogo iniciado na sala "{room}"!</h2>
        {/* Aqui você pode criar a UI do jogo real, cartas, turnos, etc */}
      </div>
    );
  }

  // Tela da sala antes do jogo começar
  return (
    <div className="p-4 font-sans text-white bg-gray-900 h-screen">
      <h2 className="text-xl mb-2">Jogadores na sala "{room}"</h2>
      <ul className="space-y-1 list-disc list-inside mb-4">
        {players.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      {isHost && (
        <button
          className="bg-blue-600 px-4 py-2 rounded"
          onClick={handleStartGame}
        >
          Iniciar Jogo
        </button>
      )}
    </div>
  );
}

export default App;
