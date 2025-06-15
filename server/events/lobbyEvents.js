const {
  addPlayerToRoom,
  createGameManagerForRoom,
  getRoomBySocketId,
  getRoomPlayers,
  isHost,
  getUsernameBySocketId,
} = require('../managers/roomManager');

module.exports = function registerLobbyEvents(io, socket) {
  socket.on('join_room', ({ username, room }) => {
    socket.join(room);
    addPlayerToRoom(room, username, socket.id);

    console.log(`👤 ${username} entrou na sala ${room}`);
  });

  socket.on('start_game', () => {
    const room = getRoomBySocketId(socket.id);
    const username = getUsernameBySocketId(socket.id);

    if (!room || !username) return;

    if (!isHost(room, socket.id)) {
      socket.emit('error_message', 'Somente o host pode iniciar o jogo.');
      return;
    }

    const gameManager = createGameManagerForRoom(room);
    gameManager.startGame();

    io.to(room).emit('game_started', room);

    console.log(`🚀 Jogo iniciado na sala ${room} por ${username}`);
  });

  socket.on('room_users', () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const players = getRoomPlayers(room); 
    io.to(room).emit('room_users', players);
  });
  
};
