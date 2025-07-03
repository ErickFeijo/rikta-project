class TurnManager {
  constructor(players) {
    this.players = players;
    this.turnIndex = 0;
    // Não define isTurn aqui — isso será feito no GameManager na hora certa
  }

  getCurrentPlayer() {
    return this.players[this.turnIndex];
  }

  advanceTurn() {
    this.players[this.turnIndex].isTurn = false;
    this.turnIndex = (this.turnIndex + 1) % this.players.length;
    this.players[this.turnIndex].isTurn = true;
  }
}

module.exports = TurnManager;
