// === generateTreasureCards.js ===
const CardTypes = require('../constants/cardTypes');

function generateTreasureCards() {
  return [
    // EQUIPAMENTOS
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
    {
      name: 'Gato de Telhado',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +1. Espanta zumbis com miados.',
      slot: 'helper',
      bonus: 1,
      copies: 2
    },
    {
      name: 'Velho do Armazém',
      type: CardTypes.EQUIPMENT,
      description: 'Bônus +2. Sabe tudo. Não corre, mas dá dica.',
      slot: 'helper',
      bonus: 2,
      copies: 1
    },

    // ITENS DE USO Único
    {
      name: 'Spray de Pimenta',
      type: CardTypes.ONE_SHOT,
      description: 'Dá +2 ao jogador em combate. Zumbi odeia ardência.',
      bonus: 2,
      target: 'player',
      copies: 2,
      applyEffect: (player, context) => {
        context.combat.addBonusToPlayer(player.id, 2);
      },
      effectText: (player) => `${player.username} usou Spray de Pimenta. Zumbi saiu lacrimejando!`
    },
    {
      name: 'Barulho de Tiro',
      type: CardTypes.ONE_SHOT,
      description: 'Atrai mais zumbis. Monstro ganha +5.',
      bonus: 5,
      target: 'monster',
      copies: 1,
      applyEffect: (_, context) => {
        context.combat.addBonusToMonster(5);
      },
      effectText: () => `O som de tiro ecoou! Mais zumbis chegaram.`
    },
    {
      name: 'Bússola do Sobrevivente',
      type: CardTypes.ITEM,
      description: 'Permite escapar automaticamente de um combate uma vez.',
      effect: 'autoEscape',
      copies: 1,
      applyEffect: (player) => {
        player.flags.autoEscape = true;
      },
      effectText: (player) => `${player.username} ativou a Bússola do Sobrevivente e fugiu na manha.`
    }
  ];
}

module.exports = generateTreasureCards;

