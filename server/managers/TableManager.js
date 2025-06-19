class TableManager {
  constructor() {
    this.tableCards = [];
    this.discardPile = [];
  }

  playCard(card) {
    if (card) {
      this.tableCards.push(card);
      this.discardPile.push(card);
    }
  }

  resetTable() {
    this.tableCards = [];
  }

  getTopDiscard() {
    return this.discardPile[this.discardPile.length - 1] || null;
  }
}

module.exports = TableManager;
