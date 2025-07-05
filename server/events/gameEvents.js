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
    if (!game) return;

    const username = getUsernameBySocketId(socket.id);
    socket.emit('game_state', game.getPrivateStateFor(username));
  });

  socket.on('kickDoor', () => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.kickDoor(socket.id);
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('state_updated', { reason: 'kickDoor' });

    result?.delayedActions?.forEach(({ delay, action }) => {
      setTimeout(() => {
        const delayedResult = game[action]();
        io.to(room).emit('state_updated', { reason: action });
      }, delay);
    });
  });

  socket.on('equip_card', ({ cardId }) => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.equipCard(socket.id, cardId);
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('state_updated', { reason: 'equipCard' });
  });

  socket.on('resolve_combat', () => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.resolveCombat();
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('combat_resolved', result);
    io.to(room).emit('state_updated', { reason: 'resolveCombat' });
  });

  socket.on('attempt_flee', () => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.attemptFlee(socket.id);
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('flee_attempted', { result });
    // io.to(room).emit('state_updated', { reason: 'attemptFlee' });
    // io.to(room).emit('end_turn', { result });
  });

  socket.on('help_player', ({ playerId }) => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.helpPlayer(playerId, socket.id);
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('state_updated', { reason: 'helpPlayer' });
  });

  socket.on('help_monster', () => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.helpMonster(socket.id);
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('state_updated', { reason: 'helpMonster' });
  });

  socket.on('add_monster_to_combat', ({ cardId }) => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.addMonsterToCombat(socket.id, cardId);

    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('state_updated', { reason: 'addMonsterToCombat' });
  });


  socket.on('finish_setup', () => {
    const room = getRoomBySocketId(socket.id);
    const game = getGameManager(room);
    if (!room || !game) return;

    const result = game.finishSetup(socket.id);
    if (result?.error) {
      socket.emit('errorMessage', result.error);
      return;
    }

    io.to(room).emit('state_updated', { reason: 'finishSetup' });
  });

  socket.on('restart_game', () => {
    const room = getRoomBySocketId(socket.id);
    const username = getUsernameBySocketId(socket.id);
    if (!room || !username) return;

    if (!isHost(room, socket.id)) {
      socket.emit('errorMessage', 'Somente o host pode reiniciar o jogo.');
      return;
    }

    const gameManager = restartGameManagerForRoom(room);
    gameManager.startGame();

    io.to(room).emit('game_restarted', room);

    gameManager.players.forEach(player => {
      io.to(player.socketId).emit('state_updated', { reason: 'restart_game' });
    });

    console.log(`🔁 Jogo reiniciado na sala ${room} por ${username}`);
  });
};
