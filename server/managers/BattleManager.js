class BattleManager {
  constructor() {
    this.activeBattle = null;
  }

  startBattle(mainPlayerId, monsterCard) {
    this.activeBattle = {
      mainPlayerId,
      monsterCard
    };
  }

  endBattle() {
    this.activeBattle = null;
  }

  getPublicState(players) {
    if (!this.activeBattle) return null;

    const mainPlayer = players.find(p => p.id === this.activeBattle.mainPlayerId);

    const equipmentObject = mainPlayer?.equipment || {};
    const equipmentArray = Object.values(equipmentObject).filter(Boolean);

    const playerPower = equipmentArray.reduce(
    (sum, card) => sum + (card.bonus || 0),
    0
    );

    return {
      mainPlayerId: this.activeBattle.mainPlayerId,
      mainPlayerName: mainPlayer?.username,
      monsterCard: {
        id: this.activeBattle.monsterCard.id,
        name: this.activeBattle.monsterCard.name,
        type: this.activeBattle.monsterCard.type,
        strength: this.activeBattle.monsterCard.strength,
        description: this.activeBattle.monsterCard.description,
      },
      playerPower,
      monsterPower: this.activeBattle.monsterCard.strength ?? 0,
      equippedCards: equipmentArray.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        type: c.type,
        bonus: c.bonus,
        }))
    };
  }
}

module.exports = BattleManager;
