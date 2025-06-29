
const {
  getGameManager,
  getRoomBySocketId,
  isHost,
  getUsernameBySocketId,
  restartGameManagerForRoom
} = require('../managers/RoomManager');

module.exports = function registerGameEvents(io, socket) {

  socket.on('get_game_state', ({ room }) => {
    const game = getGameManager(room);
    if (game) {
      socket.emit('game_state', game.getPublicState());
    }
  });

  socket.on('kickDoor', () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const game = getGameManager(room);
    if (!game) return;

    const result = game.kickDoor(socket.id);

    if (result.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

  io.to(room).emit('game_state', game.getPublicState());
  // socket.emit('game_state', game.getPublicState());
  });

socket.on('equip_card', ({ cardId }) => {
  const room = getRoomBySocketId(socket.id);
  if (!room) return;

  const game = getGameManager(room);
  if (!game) return;

  const result = game.equipCard(socket.id, cardId);
  if (result.error) return socket.emit('errorMessage', result.error);

  io.to(room).emit('game_state', game.getPublicState());
});

socket.on('restart_game', () => {
  const room = getRoomBySocketId(socket.id);
  const username = getUsernameBySocketId(socket.id);
  if (!room || !username) return;

  if (!isHost(room, socket.id)) {
    socket.emit('error_message', 'Somente o host pode reiniciar o jogo.');
    return;
  }

  const gameManager = restartGameManagerForRoom(room);
  gameManager.startGame();

  io.to(room).emit('game_restarted', room);
  io.to(room).emit('game_state', gameManager.getPublicState());

  console.log(`🔁 Jogo reiniciado na sala ${room} por ${username}`);
});

  socket.on('resolve_combat', () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const game = getGameManager(room);
    if (!game) return;

    const result = game.resolveCombat();
    if (result.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('combat_resolved', result);
    io.to(room).emit('game_state', game.getPublicState());
  });

  socket.on('attempt_flee', () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const game = getGameManager(room);
    if (!game) return;

    const result = game.attemptFlee(socket.id);
    if (result.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('flee_attempted', result);
    io.to(room).emit('game_state', game.getPublicState());
  });

  socket.on('help_player', ({ playerId }) => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const game = getGameManager(room);
    if (!game) return;

    const result = game.helpPlayer(playerId, socket.id);
    if (result.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('game_state', game.getPublicState());
  });

  socket.on('help_monster', () => {
    const room = getRoomBySocketId(socket.id);
    if (!room) return;

    const game = getGameManager(room);
    if (!game) return;

    const result = game.helpMonster(socket.id);
    if (result.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('game_state', game.getPublicState());
  });

  socket.on('finish_setup', () => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!game) return;

    const result = game.finishSetup(socket.id);
    if (result.error) return socket.emit('errorMessage', result.error);

    io.to(room).emit('game_state', game.getPublicState());
  });

};
