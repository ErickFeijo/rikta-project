const MonsterCard = require('../models/MonsterCard');

class BattleManager {
  constructor(deckManager) {
    this.activeBattle = null;
    this.deckManager = deckManager;
  }

  startBattle(mainPlayer, monsterCardPlain) {
    const monsterCard = new MonsterCard(monsterCardPlain);

    this.activeBattle = {
      mainPlayer,
      helperPlayer: null,
      monsterCards: [monsterCard] // agora é uma lista
    };
  }

  addHelper(helperPlayer) {
    if (!this.activeBattle) return { error: 'Nenhuma batalha ativa.' };
    if (this.activeBattle.helperPlayer) return { error: 'Já existe um ajudante na batalha.' };
    if (helperPlayer.id === this.activeBattle.mainPlayer.id) return { error: 'Você já está na batalha.' };

    this.activeBattle.helperPlayer = helperPlayer;
    return { success: true };
  }

  addMonster(monsterCardPlain, addedByPlayer) {
    if (!this.activeBattle) return { error: 'Nenhuma batalha ativa.' };

    const monsterCard = new MonsterCard(monsterCardPlain);

    // Adiciona o monstro com metadado de quem adicionou
    this.activeBattle.monsterCards.push({
      ...monsterCard,
      addedBy: {
        id: addedByPlayer.id,
        username: addedByPlayer.username
      }
    });

    return {
      success: true,
      message: `${monsterCard.name} foi adicionado ao combate por ${addedByPlayer.username}!`
    };
  }


  resetBattle() {
    this.activeBattle = null;
  }

  getEquippedCards(player) {
    return Object.values(player.equipment || {}).filter(Boolean);
  }

  getEquippedBonus(player) {
    return this.getEquippedCards(player).reduce((sum, card) => sum + (card.bonus || 0), 0);
  }

  getPublicState() {
    if (!this.activeBattle) {
      return {
        active: false,
        mainPlayer: null,
        helperPlayer: null,
        playerPower: 0,
        monsterPower: 0,
        monsterCards: []
      };
    }

    const { mainPlayer, helperPlayer, monsterCards } = this.activeBattle;

    const mainPlayerPower = this.getEquippedBonus(mainPlayer);
    const helperPower = helperPlayer ? this.getEquippedBonus(helperPlayer) : 0;
    const totalPlayerPower = mainPlayerPower + helperPower;
    const monsterPower = monsterCards.reduce((sum, m) => sum + (m.bonus || 0), 0);

    return {
      active: true,
      mainPlayer: {
        id: mainPlayer.id,
        username: mainPlayer.username,
        equippedCards: this.getEquippedCards(mainPlayer),
        power: mainPlayerPower
      },
      helperPlayer: helperPlayer && {
        id: helperPlayer.id,
        username: helperPlayer.username,
        equippedCards: this.getEquippedCards(helperPlayer),
        power: helperPower
      },
      playerPower: totalPlayerPower,
      monsterPower,
      monsterCards: monsterCards.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        bonus: m.bonus,
        levels: m.levels ?? 1,
        treasures: m.treasures ?? 1,
        addedBy: m.addedBy
      }))
    };
  }

  resolveCombat() {
  if (!this.activeBattle) return { error: 'Nenhuma batalha em andamento' };

  const { mainPlayer, helperPlayer, monsterCards } = this.activeBattle;

  const mainPower = this.getEquippedBonus(mainPlayer);
  const helperPower = helperPlayer ? this.getEquippedBonus(helperPlayer) : 0;
  const playerPower = mainPower + helperPower;
  const monsterPower = monsterCards.reduce((sum, m) => sum + (m.bonus || 0), 0);

  const victory = playerPower >= monsterPower;

  const attackerList = [mainPlayer.username, helperPlayer?.username].filter(Boolean);
  const attackerNames = attackerList.join(' e ');
  const monsterNames = monsterCards.map(m => m.name).join(', ');

  if (victory) {
    const rewards = monsterCards.map(monster => monster.applyRewards(mainPlayer, helperPlayer, this.deckManager));
    return {
      outcome: 'win',
      attacker: mainPlayer.username,
      helper: helperPlayer?.username || null,
      monster: monsterNames,
      attackerPower: playerPower,
      monsterPower: monsterPower,
      message: `${attackerNames} ${attackerList.length > 1 ? 'venceram' : 'venceu'} ${monsterNames}!`,
      rewards: rewards,
    };
  } else {
    const penalties = monsterCards.map(monster => monster.applyPenalties(mainPlayer));
    return {
      outcome: 'lose',
      attacker: mainPlayer.username,
      helper: helperPlayer?.username || null,
      monster: monsterNames,
      attackerPower: playerPower,
      monsterPower: monsterPower,
      message: `${attackerNames} ${attackerList.length > 1 ? 'foram derrotados por' : 'foi derrotado por'} ${monsterNames}!`,
      penalties: penalties,
    };
  }
}

  attemptFlee(player) {
    if (!this.activeBattle) return { error: 'Nenhuma batalha em andamento' };

    const roll = Math.floor(Math.random() * 6) + 1;
    const escaped = roll >= 5;

    let penalties = null;
    if (!escaped) {
      penalties = this.activeBattle.monsterCards.map(monster =>
        monster.applyPenalties(player, this.activeBattle.helperPlayer, this.deckManager)
      );
    }

    return {
      roll,
      escaped,
      message: escaped
        ? `${player.username} fugiu com sucesso!`
        : `${player.username} falhou na fuga!`,
      penalties
    };
  }
}

module.exports = BattleManager;
