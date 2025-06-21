const Player = require('../models/Player');
const DeckManager = require('./DeckManager');
const TableManager = require('./TableManager');
const TurnManager = require('./TurnManager');
const BattleManager = require('./BattleManager');

class GameManager {
  constructor(roomName, playersRaw) {
    this.room = roomName;
    this.state = 'waiting';
    this.phase = 'setup';

    this.players = playersRaw.map((p, i) => new Player(p.socketId, p.username, i === 0));
    this.deckManager = new DeckManager();
    this.tableManager = new TableManager();
    this.turnManager = new TurnManager(this.players);
    this.battleManager = new BattleManager();
  }

 startGame() {
    this.state = 'playing';
    this.phase = 'setup';
    this.deckManager.dealCards(this.players, 4);
  }

  equipCard(playerId, cardId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Jogador não encontrado' };
    if (!player.isTurn || this.phase !== 'setup') return { error: 'Não pode equipar agora' };

    const card = player.hand.find(c => c.id === cardId);
    if (!card) return { error: 'Carta não está na mão' };

    const result = player.equip(card);
    return result;
  }

  kickDoor(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Jogador não encontrado' };
    if (!player.isTurn) return { error: 'Não é seu turno' };
    if (this.phase !== 'setup') return { error: 'Não pode abrir a porta agora' };

    const card = this.deckManager.drawDoorCard();
    if (!card) return { error: 'Baralho de portas vazio' };

    this.tableManager.playToTable(card);

    if (card.type === 'monster') {
      this.phase = 'combat';
      this.battleManager.startBattle(playerId, card);
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
    const cardOpened = this.tableManager.tableCards.length > 0
      ? this.tableManager.tableCards[this.tableManager.tableCards.length - 1]
      : null;

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
        equipment: p.equipment
      })),
      cardOpened: cardOpened ? {
        id: cardOpened.id,
        name: cardOpened.name,
        description: cardOpened.description,
        type: cardOpened.type,
        strength: cardOpened.strength ?? null,
      } : null,
      battleState: this.battleManager.getPublicState(this.players),
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