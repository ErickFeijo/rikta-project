class BattleManager {
  constructor(deckManager) {
    this.activeBattle = null;
    this.deckManager = deckManager;
  }

  startBattle(mainPlayer, monsterCard) {
    this.activeBattle = {
      mainPlayer,
      helperPlayer: null,
      monsterCard
    };
  }

  addHelper(helperPlayer) {
    if (!this.activeBattle) return { error: 'Nenhuma batalha ativa.' };
    if (this.activeBattle.helperPlayer) return { error: 'Já existe um ajudante na batalha.' };
    if (helperPlayer.id === this.activeBattle.mainPlayer.id) return { error: 'Você já está na batalha.' };

    this.activeBattle.helperPlayer = helperPlayer;
    return { success: true };
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
    if (!this.activeBattle) return null;

    const { mainPlayer, helperPlayer, monsterCard } = this.activeBattle;

    const mainPlayerPower = this.getEquippedBonus(mainPlayer);
    const helperPower = helperPlayer ? this.getEquippedBonus(helperPlayer) : 0;
    const totalPlayerPower = mainPlayerPower + helperPower;
    const monsterPower = monsterCard?.bonus ?? 0;

    return {
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
      monsterCard: {
        id: monsterCard.id,
        name: monsterCard.name,
        description: monsterCard.description,
        bonus: monsterPower,
        levels: monsterCard.levels ?? 1,
        treasures: monsterCard.treasures ?? 1
      }
    };
  }

  resolveCombat() {
    if (!this.activeBattle) return { error: 'Nenhuma batalha em andamento' };

    const { mainPlayer, helperPlayer, monsterCard } = this.activeBattle;
    const mainPower = this.getEquippedBonus(mainPlayer);
    const helperPower = helperPlayer ? this.getEquippedBonus(helperPlayer) : 0;
    const playerPower = mainPower + helperPower;
    const monsterPower = monsterCard.bonus;

    const victory = playerPower >= monsterPower;

    if (victory) {
      const rewards = this.applyRewards(mainPlayer, helperPlayer, monsterCard);
      return {
        result: 'victory',
        winnerIds: [mainPlayer.id, helperPlayer?.id].filter(Boolean),
        message: `${[mainPlayer.username, helperPlayer?.username].filter(Boolean).join(' e ')} venceram o monstro!`,
        rewards
      };
    } else {
      return {
        result: 'defeat',
        message: 'Os jogadores foram derrotados! Prepare-se para tentar fugir!'
      };
    }
  }

  applyRewards(mainPlayer, helperPlayer, monsterCard) {
    const totalLevels = monsterCard.levels || 1;
    const drawnTreasures = this.deckManager.drawTreasureCard();

    mainPlayer.level += totalLevels;
    mainPlayer.hand.push(...drawnTreasures);

    return {
      levelsGained: totalLevels,
      treasuresDrawn: drawnTreasures.map(t => ({ id: t.id, name: t.name }))
    };
  }

  attemptFlee(player) {
    const roll = Math.floor(Math.random() * 6) + 1;
    const escaped = roll >= 5;

    return {
      playerId: player.id,
      roll,
      escaped,
      message: escaped ? `${player.username} fugiu com sucesso!` : `${player.username} falhou na fuga!`
    };
  }
}

module.exports = BattleManager;
