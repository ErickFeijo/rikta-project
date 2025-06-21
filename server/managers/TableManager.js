class TableManager {
  constructor() {
    this.tableCards = [];
    this.discardPile = [];
  }

  /**
   * Adiciona uma carta à mesa (área visível durante a jogada)
   */
  playToTable(card) {
    if (!card) return;
    this.tableCards.push(card);
  }

  /**
   * Remove todas as cartas da mesa e envia para o descarte
   */
  clearTableToDiscard() {
    this.discardPile.push(...this.tableCards);
    this.tableCards = [];
  }

  /**
   * Descarte direto, sem passar pela mesa (ex: efeito jogado da mão)
   */
  discardCard(card) {
    if (!card) return;
    this.discardPile.push(card);
  }

  /**
   * Recupera o topo do descarte
   */
  getTopDiscard() {
    return this.discardPile.length > 0
      ? this.discardPile[this.discardPile.length - 1]
      : null;
  }

  /**
   * Acesso seguro às cartas na mesa (imutável)
   */
  getTableCards() {
    return [...this.tableCards];
  }

  /**
   * Acesso seguro ao descarte (imutável)
   */
  getDiscardPile() {
    return [...this.discardPile];
  }
}

module.exports = TableManager;
