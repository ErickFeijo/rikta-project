const { v4: uuidv4 } = require('uuid');
const generateTreasureCards = require('../cards/treasureCards');
const generateDoorCards = require('../cards/doorCards');
const shuffle = require('../utils/shuffle');

class DeckManager {
  constructor() {
    this.doorDeck = this.createDeck(generateDoorCards());
    this.treasureDeck = this.createDeck(generateTreasureCards());
  }

  createDeck(baseCards) {
    const fullDeck = [];

    baseCards.forEach(card => {
      const copies = card.copies || 1;

      for (let i = 0; i < copies; i++) {
        fullDeck.push({
          id: uuidv4(),     // Garante ID único por instância
          ...card
        });
      }
    });

    return shuffle(fullDeck);
  }

  drawDoorCard() {
    return this.doorDeck.shift();
  }

  drawTreasureCard() {
    return this.treasureDeck.shift();
  }

  dealCards(players, cardsPerPlayer = 4) {
    players.forEach(player => {
      for (let i = 0; i < cardsPerPlayer; i++) {
        const doorCard = this.drawDoorCard();
        if (doorCard) player.hand.push(doorCard);
      }

      for (let i = 0; i < cardsPerPlayer; i++) {
        const treasureCard = this.drawTreasureCard();
        if (treasureCard) player.hand.push(treasureCard);
      }
    });
  }
}

module.exports = DeckManager;
