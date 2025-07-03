const CardTypes = require('../constants/cardTypes');

function generateTreasureCards() {
  return [
    // HEAD
    {
      name: 'Capacete de Obra',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1. Protege contra zumbis e queda de teto.',
      slot: 'head',
      bonus: 1,
      copies: 2
    },
    {
      name: 'Chapéu de Papel Alumínio',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2. Bloqueia zumbis e sinais 5G.',
      slot: 'head',
      bonus: 2,
      copies: 1
    },

    // BODY
    {
      name: 'Colete de Entregador',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1. Tem bolsos infinitos.',
      slot: 'body',
      bonus: 1,
      copies: 2
    },
    {
      name: 'Jaqueta de Couro Furado',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2. Cheia de estilo e histórias.',
      slot: 'body',
      bonus: 2,
      copies: 1
    },

    // LEGS
    {
      name: 'Calça Camuflada',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1. Difícil de ver, fácil de correr.',
      slot: 'legs',
      bonus: 1,
      copies: 2
    },
    {
      name: 'Short Jeans Rasgado',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2. Liberdade nas pernas e no estilo.',
      slot: 'legs',
      bonus: 2,
      copies: 1
    },

    // FEET
    {
      name: 'Tênis de Corrida',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1. Ideal para fugir de encrenca.',
      slot: 'feet',
      bonus: 1,
      copies: 2
    },
    {
      name: 'Botas de Combate',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2. Estilo apocalipse urbano.',
      slot: 'feet',
      bonus: 2,
      copies: 1
    },

    // LEFT/RIGHT HAND – Itens de 1 ou 2 mãos
    {
      name: 'Taco de Baseball com Pregos',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2 (1 mão). Marretada com estilo.',
      hands: 1,
      bonus: 2,
      copies: 2
    },
    {
      name: 'Frigideira Velha',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1 (1 mão). Anti-zumbi e anti-fome.',
      hands: 1,
      bonus: 1,
      copies: 2
    },
    {
      name: 'Ripa de Madeira',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1 (2 mãos). Simples, mas eficiente.',
      hands: 2,
      bonus: 1,
      copies: 1
    },
    {
      name: 'Espingarda Enferrujada',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +3 (2 mãos). Um tiro, um drama.',
      hands: 2,
      bonus: 3,
      copies: 1
    },

    // HELPER
    {
      name: 'Gato de Telhado',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1. Espanta zumbis com miados.',
      bonus: 1,
      slot: 'helper',
      copies: 2
    },
    {
      name: 'Velho do Armazém',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2. Sabe tudo. Não corre, mas dá dica.',
      bonus: 2,
      slot: 'helper',
      copies: 1
    },
  ];
}

module.exports = generateTreasureCards;
