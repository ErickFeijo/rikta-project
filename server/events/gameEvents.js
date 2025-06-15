
const {
  getGameManager,
} = require('../managers/roomManager');

module.exports = function registerGameEvents(io, socket) {

  socket.on('get_game_state', ({ room }) => {
    const game = getGameManager(room);
    if (game) {
      socket.emit('game_state', game.getPublicState());
    }
  });

};
