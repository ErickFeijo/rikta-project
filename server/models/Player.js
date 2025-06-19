class Player {
  constructor(id, username, isHost = false) {
    this.id = id;
    this.username = username;
    this.level = 1;
    this.hand = [];
    this.isHost = isHost;
    this.isTurn = false;
  }

  drawCard(deckManager) {
    const card = deckManager.draw();
    if (card) this.hand.push(card);
    return card;
  }

  playCard(cardId) {
    const index = this.hand.findIndex(c => c.id === cardId);
    if (index === -1) return null;
    return this.hand.splice(index, 1)[0];
  }
}

module.exports = Player;

