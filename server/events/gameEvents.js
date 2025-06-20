
const {
  getGameManager,
  getRoomBySocketId
} = require('../managers/RoomManager');

module.exports = function registerGameEvents(io, socket) {

  socket.on('get_game_state', ({ room }) => {
    const game = getGameManager(room);
    if (game) {
      socket.emit('game_state', game.getPublicState());
    }
  });

  socket.on('kickDoor', () => {
    const playerRoom = [...socket.rooms].find(r => r !== socket.id);
    if (!playerRoom) return;

    const game = games[playerRoom];
    if (!game) return;

    const result = game.kickDoor(socket.id);

    if (result.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(playerRoom).emit('gameState', game.getPublicState());
    io.to(playerRoom).emit('cardOpened', result.card);
  });

socket.on('equip_card', ({ cardId }) => {
  const room = getRoomBySocketId(socket.id);
  if (!room) return;

  const game = getGameManager(room);
  if (!game) return;

  const result = game.equipCard(socket.id, cardId);
  if (result.error) return socket.emit('errorMessage', result.error);

  socket.emit('game_state', game.getPublicState());
});


};
