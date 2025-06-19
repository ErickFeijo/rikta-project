const { v4: uuidv4 } = require('uuid');

class DeckManager {
  constructor() {
    this.doorDeck = this.createDoorDeck();
    this.treasureDeck = this.createTreasureDeck();
  }

  createDoorDeck() {
    const doorCards = [
      { name: 'Goblin', type: 'monster', description: 'Monstro fraco' },
      { name: 'Dragão', type: 'monster', description: 'Monstro forte' },
      { name: 'Maldição', type: 'effect', description: 'Uma maldição terrível!' },
      { name: 'Classe: Mago', type: 'class', description: 'Você vira Mago' },
    ];

    return this.shuffleAndCreateCards(doorCards);
  }

  createTreasureDeck() {
    const treasureCards = [
      { name: 'Poção de Força', type: 'boost', description: 'Aumenta sua força em combate' },
      { name: 'Armadura de Couro', type: 'item', description: 'Defesa básica' },
      { name: 'Tesouro', type: 'loot', description: 'Ganhe 1 nível' },
    ];

    return this.shuffleAndCreateCards(treasureCards);
  }

  shuffleAndCreateCards(baseCards) {
    let fullDeck = [];
    baseCards.forEach(card => {
      const copies = card.type === 'monster' || card.type === 'effect' ? 3 : 2;
      for (let i = 0; i < copies; i++) {
        fullDeck.push({ ...card, id: uuidv4() });
      }
    });

    for (let i = fullDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    return fullDeck;
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
        const card = this.drawDoorCard();
        if (card) player.hand.push(card);
      }
      for (let i = 0; i < cardsPerPlayer; i++) {
        const card = this.drawTreasureCard();
        if (card) player.hand.push(card);
      }
    });
  }
}

module.exports = DeckManager;
