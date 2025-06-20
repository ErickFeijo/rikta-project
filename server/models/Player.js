class Player {
  constructor(id, username, isHost = false) {
    this.id = id;
    this.username = username;
    this.level = 1;
    this.hand = [];

    this.equipment = {
      head: null,
      body: null,
      feet: null,
      leftHand: null,
      rightHand: null,
    };

    this.isHost = isHost;
    this.isTurn = false;
  }

  equip(card) {
    if (!card) return { error: 'Carta inválida' };

    if (card.slot) {
      const slotMap = {
        head: 'head',
        armor: 'body',
        feet: 'feet',
      };

      const targetSlot = slotMap[card.slot];
      if (!targetSlot) return { error: `Slot desconhecido: ${card.slot}` };

      // Substitui o equipamento anterior, se houver
      if (this.equipment[targetSlot]) {
        this.hand.push(this.equipment[targetSlot]);
      }

      this.equipment[targetSlot] = card;
    }
    // Equipamentos de mão
    else if (card.hands) {

      if (card.hands === 2) {
        // Desocupa as duas mãos
        this._returnHandItemToHand('leftHand');
        this._returnHandItemToHand('rightHand');

        this.equipment.leftHand = card;
        this.equipment.rightHand = card;

      }
      else if (card.hands === 1) {

        if (!this.equipment.leftHand) {
          this.equipment.leftHand = card;
        } else if (!this.equipment.rightHand) {
          this.equipment.rightHand = card;
        } else {
          // Se ambas estão ocupadas, substitui a esquerda
          this._returnHandItemToHand('leftHand');
          this.equipment.leftHand = card;
        }

      }

    } else {
      return { error: 'Carta não equipável' };
    }

    // Remove da mão
    this._removeCardFromHand(card.id);
    return { success: true };
  }

  unequip(slot) {
    if (!this.equipment[slot]) return;
    this.hand.push(this.equipment[slot]);
    this.equipment[slot] = null;

    // Se era item de duas mãos, limpa os dois slots
    if (slot === 'leftHand' || slot === 'rightHand') {
      if (this.equipment.leftHand === this.equipment.rightHand) {
        this.equipment.leftHand = null;
        this.equipment.rightHand = null;
      }
    }
  }

  drawCard(deckManager) {
    const card = deckManager.draw();
    if (card) this.hand.push(card);
    return card;
  }

  playCard(cardId) {
    const index = this.hand.findIndex(c => c.id === cardId);
    if (index === -1) return null;
    return this.hand.splice(index, 1)[0];
  }

  getEquipmentBonus() {
    const equippedItems = Object.values(this.equipment);
    return equippedItems.reduce((sum, item) => sum + (item?.bonus || 0), 0);
  }

  _removeCardFromHand(cardId) {
    const index = this.hand.findIndex(c => c.id === cardId);
    if (index !== -1) this.hand.splice(index, 1);
  }

  _returnHandItemToHand(slot) {
    const item = this.equipment[slot];
    if (item) {
      this.hand.push(item);
      this.equipment[slot] = null;
    }
  }
}

module.exports = Player;
