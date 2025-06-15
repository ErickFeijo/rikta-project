const rooms = {}; // { roomName: [ { username, socketId } ] }

function addPlayerToRoom(room, username, socketId) {
  if (!rooms[room]) rooms[room] = [];
  if (!rooms[room].some((p) => p.socketId === socketId)) {
    rooms[room].push({ username, socketId });
  }
}

function removePlayerFromRoom(room, socketId) {
  if (!rooms[room]) return;
  rooms[room] = rooms[room].filter((p) => p.socketId !== socketId);
}

function getRoomPlayers(room) {
  const players = rooms[room] || [];
  return players.map((player, index) => ({
    id: player.socketId,
    name: player.username,
    isHost: index === 0
  }));
}

function getRoomBySocketId(socketId) {
  for (const room in rooms) {
    if (rooms[room].some((p) => p.socketId === socketId)) {
      return room;
    }
  }
  return null;
}

function getUsernameBySocketId(socketId) {
  for (const room in rooms) {
    const player = rooms[room].find((p) => p.socketId === socketId);
    if (player) return player.username;
  }
  return null;
}

function isHost(room, socketId) {
  return rooms[room]?.[0]?.socketId === socketId;
}

module.exports = {
  addPlayerToRoom,
  removePlayerFromRoom,
  getRoomPlayers,
  getRoomBySocketId,
  getUsernameBySocketId,
  isHost,
};
