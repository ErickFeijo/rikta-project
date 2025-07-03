// === GameManager.js ===
const Player = require('../models/Player');
const DeckManager = require('./DeckManager');
const TableManager = require('./TableManager');
const TurnManager = require('./TurnManager');
const BattleManager = require('./BattleManager');

const phaseHints = {
  waiting: {
    active: 'Aguardando todos os jogadores entrarem...',
    spectator: 'Aguardando todos os jogadores entrarem...',
  },
  initialSetup: {
    active: 'Equipe suas cartas e clique em "Finalizar Setup" quando estiver pronto.',
    spectator: 'Aguardando os outros jogadores finalizarem o setup...',
  },
  setup: {
    active: 'É sua vez! Você pode equipar cartas ou abrir uma porta.',
    spectator: 'Aguardando o jogador da vez abrir uma porta...',
  },
  resolveEffect: {
    active: 'Resolva o efeito da carta revelada.',
    spectator: 'Aguardando o jogador resolver o efeito da carta.',
  },
  combat: {
    active: 'Você está em combate! Use cartas ou peça ajuda.',
    spectator: 'O jogador está em combate! Você pode oferecer ajuda.',
  },
  loot: {
    active: 'Você venceu! Pegue seus tesouros antes de encerrar a vez.',
    spectator: 'O jogador venceu! Aguardando ele pegar os tesouros.',
  },
  flee: {
    active: 'Você perdeu! Role o dado para tentar fugir.',
    spectator: 'O jogador está tentando fugir do combate...',
  }
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

    // Ninguém está em turno ainda na fase inicial
    this.players.forEach(p => p.isTurn = false);
  }


  finishSetup(socketId) {
    const player = this.players.find(p => p.id === socketId);
    if (!player) return { error: 'Jogador não encontrado.' };

    this.setupFinishedPlayers.add(socketId);

    if (this.setupFinishedPlayers.size === this.players.length) {
      this.phase = 'setup';

      // Começa o turno normalmente
      this.turnManager.turnIndex = 0;
      this.players.forEach(p => (p.isTurn = false));
      const current = this.turnManager.getCurrentPlayer();
      current.isTurn = true;
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

    const fleeResult = this.battleManager.attemptFlee(player);
    this.phase = 'effect';
    this.endTurn();

    const currentTurnPlayer = this.turnManager.getCurrentPlayer();

    return {
      type: 'flee_attempted',
      data: {
        playerId: player.id,
        username: player.username,
        roll: fleeResult.roll,
        escaped: fleeResult.escaped,
        message: fleeResult.message,
        penalties: fleeResult.penalties,
        nextPlayer: {
          id: currentTurnPlayer.id,
          username: currentTurnPlayer.username,
        }
      }
    };
  }

  endTurn() {
    const current = this.turnManager.getCurrentPlayer();
    current.isTurn = false;

    this.turnManager.advanceTurn();
    const next = this.turnManager.getCurrentPlayer();
    next.isTurn = true;

    this.tableManager.clearTableToDiscard();
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
      players: this.players.map(p => ({
        id: p.id,
        username: p.username,
        level: p.level,
        isTurn: p.isTurn,
        isHost: p.isHost,
        equipment: p.equipment
      })),
      cardOpened,
      battleState: this.battleManager.getPublicState(),
      doorDeckCount: this.deckManager.doorDeck.length,
      treasureDeckCount: this.deckManager.treasureDeck.length
    };
  }

  getPrivateStateFor(playerId) {
    const publicState = this.getPublicState();
    const player = this.players.find(p => p.username === playerId);

    let hintMessage = '';
    const phaseHint = phaseHints[this.phase] || {};

    if (this.phase === 'initialSetup') {
      const hasFinished = this.setupFinishedPlayers.has(player?.id);
      hintMessage = hasFinished ? phaseHint.spectator : phaseHint.active;
    } else {
      const isCurrentPlayer = player?.isTurn ?? false;
      hintMessage = isCurrentPlayer ? phaseHint.active : phaseHint.spectator || '';
    }

    return {
      ...publicState,
      hand: player?.hand || [],
      hintMessage,
      hasFinishedSetup: this.setupFinishedPlayers.has(player?.id) 
    };
  }

}

module.exports = GameManager;