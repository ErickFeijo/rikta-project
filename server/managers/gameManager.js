const Player = require('../models/Player');
const DeckManager = require('./DeckManager');
const TableManager = require('./TableManager');
const TurnManager = require('./TurnManager');

class GameManager {
  constructor(roomName, playersRaw) {
    this.room = roomName;
    this.state = 'waiting';
    this.phase = 'setup';

    this.players = playersRaw.map((p, i) => new Player(p.id, p.username, i === 0));
    this.deckManager = new DeckManager();
    this.tableManager = new TableManager();
    this.turnManager = new TurnManager(this.players);
  }

 startGame() {
    this.state = 'playing';
    this.phase = 'setup';
    this.deckManager.dealCards(this.players, 4);
  }

  kickDoor(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Jogador não encontrado' };
    if (!player.isTurn) return { error: 'Não é seu turno' };
    if (this.phase !== 'kickDoor') return { error: 'Não pode abrir a porta agora' };

    const card = this.deckManager.drawDoorCard();
    if (!card) return { error: 'Baralho de portas vazio' };

    this.tableManager.addCard(card);

    if (card.type === 'monster') {
      this.phase = 'combat';
    } else if (card.type === 'effect') {
      this.phase = 'resolveEffect';
    } 

    return { success: true, card, phase: this.phase };
  }

  advancePhase() {
    const phaseOrder = ['setup', 'draw', 'battle', 'loot', 'charity'];
    const currentIndex = phaseOrder.indexOf(this.phase);

    if (currentIndex === phaseOrder.length - 1) {
      this.phase = 'setup';
      this.endTurn();
    } else {
      this.phase = phaseOrder[currentIndex + 1];
    }
  }

  endTurn() {
    this.turnManager.getCurrentPlayer().isTurn = false;
    this.turnManager.advanceTurn();
    this.tableManager.resetTable();
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
        hand: p.hand,
      })),
      tableCards: this.tableManager.tableCards,
      topDiscardCard: this.tableManager.getTopDiscard(),
      doorDeckCount: this.deckManager.doorDeck.length,
      treasureDeckCount: this.deckManager.treasureDeck.length,
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