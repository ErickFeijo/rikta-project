const { addPlayerToRoom, removePlayerFromRoom, getRoomPlayers, getRoomBySocketId, getUsernameBySocketId, isHost } = require('./rooms/roomManager');
const registerLoginEvents = require('./events/loginEvents');
const registerLobbyEvents = require('./events/lobbyEvents');
const registerGameEvents = require('./events/gameEvents');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('🔌 Novo jogador conectado:', socket.id);

    registerLoginEvents(io, socket);
    registerLobbyEvents(io, socket);
    registerGameEvents(io, socket);

    socket.on('disconnect', () => {
      const room = getRoomBySocketId(socket.id);
      if (!room) return;

      removePlayerFromRoom(room, socket.id);
      const updatedPlayers = getRoomPlayers(room);
      io.to(room).emit('room_users', updatedPlayers.map(p => ({ username: p.username })));

      console.log(`❌ Jogador saiu: ${socket.id} da sala ${room}`);
    });
  });
};
