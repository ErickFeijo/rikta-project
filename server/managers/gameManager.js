const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos nas cartas

class GameManager {
  constructor(roomName, players) {
    this.room = roomName;
    this.state = 'waiting'; // waiting | playing | ended
    this.phase = 'setup';   // setup | draw | battle | loot | charity

    this.players = players.map((p, i) => ({
      id: p.id,
      username: p.username,
      level: 1,
      hand: [],
      isHost: i === 0,
      isTurn: i === 0
    }));

    this.turnIndex = 0;
    this.deck = this.createDeck();
    this.discardPile = [];
    this.tableCards = [];
  }

  createDeck() {
    const baseCards = [
      { name: 'Goblin', type: 'monster', description: 'Monstro fraco' },
      { name: 'Dragão', type: 'monster', description: 'Monstro forte' },
      { name: 'Poção de Força', type: 'boost', description: 'Aumenta sua força em combate' },
      { name: 'Armadura de Couro', type: 'item', description: 'Defesa básica' },
      { name: 'Tesouro', type: 'loot', description: 'Ganhe 1 nível' },
    ];

    // Duplica algumas cartas e gera ID único
    let fullDeck = [];
    baseCards.forEach(card => {
      const copies = card.type === 'monster' ? 3 : 2;
      for (let i = 0; i < copies; i++) {
        fullDeck.push({ ...card, id: uuidv4() });
      }
    });

    // Embaralhar
    for (let i = fullDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    return fullDeck;
  }

  startGame() {
    this.state = 'playing';
    this.phase = 'draw';
    this.dealCards();
    console.log(`🎮 Jogo iniciado na sala ${this.room}`);
  }

  dealCards() {
    const cardsPerPlayer = 4;
    for (let player of this.players) {
      player.hand = this.deck.splice(0, cardsPerPlayer);
    }
  }

  getCurrentPlayer() {
    return this.players[this.turnIndex];
  }

  advancePhase() {
    switch (this.phase) {
      case 'draw':
        this.phase = 'battle';
        break;
      case 'battle':
        this.phase = 'loot';
        break;
      case 'loot':
        this.phase = 'charity';
        break;
      case 'charity':
        this.endTurn();
        break;
      default:
        this.phase = 'draw';
    }
  }

  endTurn() {
    this.players[this.turnIndex].isTurn = false;
    this.turnIndex = (this.turnIndex + 1) % this.players.length;
    this.players[this.turnIndex].isTurn = true;
    this.phase = 'draw';
    this.tableCards = [];
    console.log(`🔄 Turno de ${this.players[this.turnIndex].username}`);
  }

  playCard(playerId, cardId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return { error: 'Não é seu turno' };

    const index = player.hand.findIndex(c => c.id === cardId);
    if (index === -1) return { error: 'Carta não encontrada na mão' };

    const card = player.hand.splice(index, 1)[0];
    this.tableCards.push(card); // Simula jogada para a mesa
    this.discardPile.push(card); // Simula descarte

    // TODO: aplicar efeito real da carta
    return { success: true, cardPlayed: card };
  }

  drawCard(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return { error: 'Não é seu turno' };

    const card = this.deck.shift();
    if (card) player.hand.push(card);
    return card || null;
  }

  getPublicState() {
    return {
      room: this.room,
      state: this.state,
      phase: this.phase,
      players: this.players.map(p => ({
        id: p.id,
        username: p.username,
        level: p.level,
        isTurn: p.isTurn,
        isHost: p.isHost,
      })),
      tableCards: this.tableCards,
      topDiscardCard: this.discardPile[this.discardPile.length - 1] || null
    };
  }

  getPrivateStateFor(playerId) {
    const publicState = this.getPublicState();
    const player = this.players.find(p => p.id === playerId);
    return {
      ...publicState,
      hand: player?.hand || []
    };
  }
}

module.exports = GameManager;
