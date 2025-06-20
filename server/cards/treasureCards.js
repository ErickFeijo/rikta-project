const CardTypes = require('../constants/cardTypes');

function generateTreasureCards() {
  return [
    { name: 'Elmo de Ferro', type: CardTypes.EQUIPMENT, description: 'Bônus +1', slot: 'head', bonus: 1, copies: 2 },
    { name: 'Botas de Couro', type: CardTypes.EQUIPMENT, description: 'Bônus +1', slot: 'feet', bonus: 1, copies: 2 },
    { name: 'Armadura Simples', type: CardTypes.EQUIPMENT, description: 'Bônus +2', slot: 'armor', bonus: 2, copies: 2 },
    { name: 'Espada Curta', type: CardTypes.EQUIPMENT, description: 'Bônus +1 (1 mão)', hands: 1, bonus: 1, copies: 2 },
    { name: 'Escudo de Madeira', type: CardTypes.EQUIPMENT, description: 'Bônus +1 (1 mão)', hands: 1, bonus: 1, copies: 2 },
    // Adicione mais cartas conforme desejar
  ];
}

module.exports = generateTreasureCards;
