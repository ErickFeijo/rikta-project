const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Armazena salas e jogadores (exemplo simples)
const rooms = {}; // { roomName: [usernames] }

io.on('connection', (socket) => {
  console.log('Novo jogador conectado:', socket.id);

  // Evento para entrar na sala
  socket.on('join_room', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(username);

    // Envia para todos da sala a lista atualizada
    io.to(room).emit('room_users', rooms[room]);
  });

  // Evento desconectar
  socket.on('disconnect', () => {
    const { room, username } = socket;
    console.log('Jogador desconectado:', socket.id);
    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u !== username);
      io.to(room).emit('room_users', rooms[room]);
    }
  });

  // Evento inciar o jogo
  socket.on('start_game', () => {
    const { room, username } = socket;

    if (!room || !username) return;

    // Verifica se é o primeiro jogador da sala (host)
    if (rooms[room] && rooms[room][0] === username) {
      io.to(room).emit('game_started');
      console.log(`Jogo iniciado na sala ${room} pelo host ${username}`);
    } else {
      socket.emit('error_message', 'Somente o host pode iniciar o jogo.');
    }
  });

});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
