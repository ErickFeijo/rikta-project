const { v4: uuidv4 } = require('uuid');
const CardTypes = require('../constants/cardTypes');

const monsters = [
  {
    name: 'Zumbi de Escritório',
    description: 'Ainda cheira a café. Força +1.',
    strength: 1,
  },
  {
    name: 'Influencer Infectado',
    description: 'Tenta te morder e ainda te vender curso. Força +2.',
    strength: 2,
  },
  {
    name: 'Motoboy Zumbi',
    description: 'Entrega mordidas em alta velocidade. Força +3.',
    strength: 3,
  },
  {
    name: 'Zumbi Crossfiteiro',
    description: 'Grita "Boraaa!" antes de atacar. Força +4.',
    strength: 4,
  },
  {
    name: 'Mutante Radioativo',
    description: 'Brilha no escuro e morde forte. Força +5.',
    strength: 5,
  },
  {
    name: 'Ex Chefe Ressuscitado',
    description: 'Te persegue com reuniões eternas. Força +6.',
    strength: 6,
  },
  {
    name: 'Horda Descontrolada',
    description: 'Zumbis demais pra contar. Força +7.',
    strength: 7,
  },
  {
    name: 'Zumbi de Estimação',
    description: 'Fofo, mas ainda quer te devorar. Força +1.',
    strength: 1,
  },
];

const curses = [
  {
    name: 'Perde o Sinal do Rádio',
    description: 'Você não pode pedir ajuda nesta rodada.',
  },
  {
    name: 'Travou a Tranca',
    description: 'Você perde 1 nível tentando abrir a porta.',
  },
  {
    name: 'Comida Estragada',
    description: 'Descarta uma carta da mão.',
  },
  {
    name: 'Armadilha de Urso',
    description: 'Você perde um equipamento à sua escolha.',
  },
];

function generateDoorDeck() {
  const deck = [];

  // Adiciona monstros
  monsters.forEach(monster => {
    const copies = monster.strength <= 2 ? 3 : 2;
    for (let i = 0; i < copies; i++) {
      deck.push({
        id: uuidv4(),
        name: monster.name,
        description: monster.description,
        type: CardTypes.MONSTER,
        strength: monster.strength,
      });
    }
  });

  // Adiciona maldições
  curses.forEach(curse => {
    for (let i = 0; i < 2; i++) {
      deck.push({
        id: uuidv4(),
        name: curse.name,
        description: curse.description,
        type: CardTypes.EFFECT,
      });
    }
  });

  return deck;
}

module.exports = generateDoorDeck;
