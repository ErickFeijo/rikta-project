module.exports = function registerGameEvents(io, socket) {
  socket.on('player_ready', () => {
    // lógica de "pronto"
  });

  socket.on('play_card', (cardData) => {
    // lógica de jogar carta
  });

  socket.on('end_turn', () => {
    // lógica de passar o turno
  });
};
