const { v4: uuidv4 } = require('uuid');
const CardTypes = require('../constants/cardTypes');

const monsters = [
  { name: 'Goblin', description: 'Um monstro fraco. +1 de força.', strength: 1 },
  { name: 'Esqueleto', description: 'Assustador, mas frágil. +2 de força.', strength: 2 },
  { name: 'Orc', description: 'Brutamontes. +3 de força.', strength: 3 },
  { name: 'Troll das Cavernas', description: 'Causa problemas. +4 de força.', strength: 4 },
  { name: 'Dragão', description: 'Um desafio formidável. +6 de força.', strength: 6 },
  { name: 'Lagarto', description: 'Um asd. +asd força.', strength: 5 },
];

const curses = [
  { name: 'Perde um nível', description: 'Você perde 1 nível imediatamente.' },
  { name: 'Caiu na armadilha', description: 'Descarte uma carta aleatória da mão.' },
  { name: 'Quebrou seu equipamento', description: 'Descarte um item equipado.' },
  { name: 'Amnésia súbita', description: 'Você não pode jogar cartas nesta rodada.' },
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
