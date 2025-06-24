const {
  addPlayerToRoom,
  removePlayerFromRoom,
  getRoomBySocketId,
  getRoomPlayers,
  isHost,
  getUsernameBySocketId,
} = require('../managers/RoomManager');

module.exports = function registerLoginEvents(io, socket) {
 
    socket.on('join_room', ({ username, room }) => {
      socket.join(room);
      addPlayerToRoom(room, username, socket.id);

      const players = getRoomPlayers(room);
      io.to(room).emit('room_users', players.map(p => ({ username: p.username })));

      console.log(`✅ ${username} entrou na sala ${room}`);
    });

};
