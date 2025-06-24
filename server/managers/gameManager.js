// === GameManager.js ===
const Player = require('../models/Player');
const DeckManager = require('./DeckManager');
const TableManager = require('./TableManager');
const TurnManager = require('./TurnManager');
const BattleManager = require('./BattleManager');

const phaseHints = {
  waiting: 'Aguardando todos os jogadores entrarem...',
  initialSetup: 'Equipe suas cartas e clique em "Finalizar Setup" quando estiver pronto.',
  setup: 'É sua vez! Você pode equipar cartas ou abrir uma porta.',
  resolveEffect: 'Resolva o efeito da carta revelada.',
  combat: 'Você está em combate! Use cartas ou peça ajuda.',
  loot: 'Você venceu! Pegue seus tesouros antes de encerrar a vez.',
  flee: 'Você perdeu! Role o dado para tentar fugir.',
};

class GameManager {
  constructor(roomName, playersRaw) {
    this.room = roomName;
    this.state = 'waiting';
    this.phase = 'initialSetup';

    this.players = playersRaw.map((p, i) => new Player(p.socketId, p.username, i === 0));
    this.deckManager = new DeckManager();
    this.tableManager = new TableManager();
    this.turnManager = new TurnManager(this.players);
    this.battleManager = new BattleManager(this.deckManager);
    this.setupFinishedPlayers = new Set(); // track quem finalizou o setup
  }

  startGame() {
    this.state = 'playing';
    this.phase = 'initialSetup';
    this.deckManager.dealCards(this.players, 4);
  }

  finishSetup(socketId) {
    const player = this.players.find(p => p.id === socketId);
    if (!player) return { error: 'Jogador não encontrado.' };

    this.setupFinishedPlayers.add(socketId);

    if (this.setupFinishedPlayers.size === this.players.length) {
      this.phase = 'setup'; 
      this.turnManager.turnIndex = 0;
      this.players.forEach(p => (p.isTurn = false));
      this.turnManager.getCurrentPlayer().isTurn = true;
    }

    return { success: true };
  }

  helpPlayer(playerId, helperSocketId) {
    const helper = this.players.find(p => p.id === helperSocketId);
    if (!helper) return { error: 'Jogador ajudante não encontrado' };

    return this.battleManager.addHelper(helper);
  }

  helpMonster(playerId) {
    // Aqui você pode futuramente implementar o uso de carta ou aumento de força
    // Por ora, retornamos apenas uma mensagem placeholder
    return { success: true, message: 'Ajuda ao monstro não implementada ainda.' };
  }

  equipCard(playerId, cardId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Jogador não encontrado' };

    // 💡 Agora permite equipar tanto no initialSetup quanto no setup de turno
    if (!['initialSetup', 'setup'].includes(this.phase)) {
      return { error: 'Não pode equipar agora' };
    }

    const card = player.hand.find(c => c.id === cardId);
    if (!card) return { error: 'Carta não está na mão' };

    return player.equip(card);
  }

  kickDoor(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Jogador não encontrado' };

    if (this.phase === 'initialSetup') return { error: 'O jogo ainda não começou' };
    if (!player.isTurn || this.phase !== 'setup') return { error: 'Não é sua vez' };

    const card = this.deckManager.drawDoorCard();
    if (!card) return { error: 'Baralho de portas vazio' };

    this.tableManager.playToTable(card);

    if (card.type === 'monster') {
      this.phase = 'combat';
      this.battleManager.startBattle(player, card);
    } else {
      this.phase = 'resolveEffect';
    }

    return { success: true, card, phase: this.phase };
  }

  resolveCombat() {
    const result = this.battleManager.resolveCombat();
    if (result.result === 'victory') {
      this.phase = 'loot';
    } else {
      this.phase = 'flee';
    }
    return result;
  }

  attemptFlee(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Jogador não encontrado' };
    return this.battleManager.attemptFlee(player);
  }

  endTurn() {
    this.turnManager.getCurrentPlayer().isTurn = false;
    this.turnManager.advanceTurn();
    this.tableManager.resetTable();
    this.battleManager.resetBattle();
    this.phase = 'setup';
  }

  getPublicState() {
      const cardOpened = this.tableManager.tableCards.length > 0
    ? this.tableManager.tableCards[this.tableManager.tableCards.length - 1]
    : null;


    return {
      room: this.room,
      state: this.state,
      phase: this.phase,
      hintMessage: phaseHints[this.phase] ?? '',
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
        bonus: cardOpened.bonus ?? null,
      } : null,
      battleState: this.battleManager.getPublicState(),
      doorDeckCount: this.deckManager.doorDeck.length,
      treasureDeckCount: this.deckManager.treasureDeck.length
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