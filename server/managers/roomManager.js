const rooms = {}; 
/*
  rooms = {
    roomName: {
      players: [ { username, socketId } ],
      gameManager: null | instancia de GameManager
    }
  }
*/
const GameManager = require('./GameManager');

function addPlayerToRoom(room, username, socketId) {
  if (!rooms[room]) rooms[room] = { players: [], gameManager: null };

  if (!rooms[room].players.some((p) => p.socketId === socketId)) {
    rooms[room].players.push({ username, socketId });
  }
}

function removePlayerFromRoom(room, socketId) {
  if (!rooms[room]) return;

  rooms[room].players = rooms[room].players.filter((p) => p.socketId !== socketId);

  if (rooms[room].players.length === 0) {
    rooms[room].gameManager = null;
  }
}

function getRoomPlayers(room) {
  const players = rooms[room]?.players || [];
  return players.map((player, index) => ({
    id: player.socketId,
    name: player.username,
    isHost: index === 0
  }));
}

function getRoomBySocketId(socketId) {
  for (const room in rooms) {
    if (rooms[room].players.some((p) => p.socketId === socketId)) {
      return room;
    }
  }
  return null;
}

function getUsernameBySocketId(socketId) {
  for (const room in rooms) {
    const player = rooms[room].players.find((p) => p.socketId === socketId);
    if (player) return player.username;
  }
  return null;
}

function isHost(room, socketId) {
  return rooms[room]?.players?.[0]?.socketId === socketId;
}

function createGameManagerForRoom(room) {
  if (!rooms[room]) return null;
  if (rooms[room].gameManager) return rooms[room].gameManager; // já existe

  const players = rooms[room].players;
  rooms[room].gameManager = new GameManager(room, players);
  
  return rooms[room].gameManager;
}

function restartGameManagerForRoom(room) {
  if (!rooms[room]) return null;

  const players = rooms[room].players;
  rooms[room].gameManager = new GameManager(room, players);

  return rooms[room].gameManager;
}

function getGameManager(room) {
  return rooms[room]?.gameManager || null;
}

function removeGameManager(room) {
  if (rooms[room]) {
    rooms[room].gameManager = null;
  }
}

module.exports = {
  addPlayerToRoom,
  removePlayerFromRoom,
  getRoomPlayers,
  getRoomBySocketId,
  getUsernameBySocketId,
  isHost,
  createGameManagerForRoom,
  getGameManager,
  removeGameManager,
  restartGameManagerForRoom
};
