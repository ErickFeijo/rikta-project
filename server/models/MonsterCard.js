class MonsterCard {
  constructor({
    id,
    name,
    description,
    bonus,
    levels = 1,
    treasures = 1,
    applyRewards,
    applyPenalties,
    type,
    rewardsText,
    penaltiesText
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.bonus = bonus;
    this.levels = levels;
    this.treasures = treasures;
    this.type = type || 'monster';

    this._applyRewards = applyRewards;
    this._applyPenalties = applyPenalties;

    this.rewardsText = rewardsText || `+${levels} Nvl +${treasures} Tes.`;
    this.penaltiesText = penaltiesText || '-1 Nvl';
  }

  applyRewards(mainPlayer, helperPlayer, deckManager) {
    if (typeof this._applyRewards === 'function') {
      return this._applyRewards(mainPlayer, helperPlayer, deckManager);
    }

    mainPlayer.level += this.levels;
    
    for (let i = 0; i < this.treasures; i++) {
      const treasure = deckManager.drawTreasureCard();
      mainPlayer.hand.push(treasure);
    }

    return {
      message: `${mainPlayer.username} ganhou ${this.levels} nível${this.levels > 1 ? 's' : ''} e ${this.treasures} tesouro${this.treasures > 1 ? 's' : ''}.`
    };
  }

  applyPenalties(mainPlayer) {
    if (typeof this._applyPenalties === 'function') {
      return this._applyPenalties(mainPlayer);
    }

    mainPlayer.level = mainPlayer.level - 1;

    return {
      message: `${mainPlayer.username} perdeu 1 nível.`
    };
  }
}

module.exports = MonsterCard;
