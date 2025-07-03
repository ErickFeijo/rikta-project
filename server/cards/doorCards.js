const { v4: uuidv4 } = require('uuid');
const CardTypes = require('../constants/cardTypes');
const MonsterCard = require('../models/MonsterCard');

const monsters = [
  {
    name: 'Zumbi de Escritório',
    description: 'Ainda cheira a café. Força +1.',
    bonus: 1,
    levels: 1,
    treasures: 1,
    penaltiesText: 'Perde 1 carta da mão.',
    applyPenalties(mainPlayer) {
      if (mainPlayer.hand.length > 0) {
        const discarded = mainPlayer.hand.pop();
        return {
          message: `${mainPlayer.username} perdeu uma carta da mão: ${discarded.name}`
        };
      }
      return { message: `${mainPlayer.username} não tinha cartas para perder.` };
    }
  },
  {
    name: 'Influencer Infectado',
    description: 'Tenta te morder e ainda te vender curso. Força +2.',
    bonus: 2,
    levels: 1,
    treasures: 1,
    rewardsText: 'Ganha 1 nível e um curso de "Zumbificação Digital".',
    penaltiesText: 'Perde 1 nível por golpe digital.',
    applyRewards(mainPlayer) {
      mainPlayer.level += 1;
      return {
        message: `${mainPlayer.username} ganhou 1 nível e um curso gratuito de "Zumbificação Digital"!`
      };
    },
    applyPenalties(mainPlayer) {
      mainPlayer.level = mainPlayer.level - 1;
      return {
        message: `${mainPlayer.username} caiu em golpe de curso online e perdeu 1 nível!`
      };
    }
  },
  {
    name: 'Motoboy Zumbi',
    description: 'Entrega mordidas em alta velocidade. Força +3.',
    bonus: 3,
    levels: 2,
    treasures: 1,
    penaltiesText: 'Perde a próxima vez de jogar.',
    applyPenalties(mainPlayer) {
      return {
        message: `${mainPlayer.username} foi atropelado e perde a próxima rodada!`
      };
    }
  },
  {
    name: 'Zumbi Crossfiteiro',
    description: 'Grita "Boraaa!" antes de atacar. Força +4.',
    bonus: 4,
    levels: 2,
    treasures: 2,
    penaltiesText: 'Perde 2 níveis por overtraining.',
    applyPenalties(mainPlayer) {
      mainPlayer.level = Math.max(1, mainPlayer.level - 2);
      return {
        message: `${mainPlayer.username} não aguentou o treino e perdeu 2 níveis.`
      };
    }
  },
  {
    name: 'Mutante Radioativo',
    description: 'Brilha no escuro e morde forte. Força +5.',
    bonus: 5,
    levels: 2,
    treasures: 2,
    rewardsText: 'Todos ganham 1 tesouro extra por radiação.',
    penaltiesText: 'Perde todos os equipamentos.',
    applyRewards(mainPlayer, helperPlayer, deckManager) {
      const treasure = deckManager.drawTreasureCard();
      mainPlayer.hand.push(treasure);
      if (helperPlayer) helperPlayer.hand.push(treasure);
      return {
        message: `Radiação afetou tudo! ${mainPlayer.username} e ${helperPlayer?.username || 'ninguém'} ganharam 1 tesouro cada.`
      };
    },
    applyPenalties(mainPlayer) {
      mainPlayer.equipment = {};
      return {
        message: `${mainPlayer.username} derreteu e perdeu todos os equipamentos!`
      };
    }
  },
  {
    name: 'Ex Chefe Ressuscitado',
    description: 'Te persegue com reuniões eternas. Força +6.',
    bonus: 6,
    levels: 3,
    treasures: 2,
    penaltiesText: 'Volta ao nível 1 por burnout.',
    applyPenalties(mainPlayer) {
      mainPlayer.level = 1;
      return {
        message: `${mainPlayer.username} teve burnout com tanta reunião. Nível caiu pra 1!`
      };
    }
  },
  {
    name: 'Horda Descontrolada',
    description: 'Zumbis demais pra contar. Força +7.',
    bonus: 7,
    levels: 3,
    treasures: 3,
    penaltiesText: 'Perde todas as cartas da mão.',
    applyPenalties(mainPlayer) {
      mainPlayer.hand = [];
      return {
        message: `${mainPlayer.username} foi cercado e perdeu todas as cartas da mão!`
      };
    }
  },
  {
    name: 'Zumbi de Estimação',
    description: 'Fofo, mas ainda quer te devorar. Força +1.',
    bonus: 1,
    levels: 1,
    treasures: 1,
    rewardsText: 'Adota o zumbi e ganha 1 nível.',
    applyRewards(mainPlayer) {
      mainPlayer.level += 1;
      return {
        message: `${mainPlayer.username} adotou o zumbi e ganhou 1 nível! 🐶🧟`
      };
    }
  }
];

function generateDoorDeck() {
  const deck = [];

  monsters.forEach(monster => {
    const copies = monster.bonus <= 2 ? 3 : 2;

    for (let i = 0; i < copies; i++) {
      deck.push(new MonsterCard({
        id: uuidv4(),
        name: monster.name,
        description: monster.description,
        bonus: monster.bonus,
        levels: monster.levels,
        treasures: monster.treasures,
        rewardsText: monster.rewardsText,
        penaltiesText: monster.penaltiesText,
        type: CardTypes.MONSTER,
        applyRewards: monster.applyRewards,
        applyPenalties: monster.applyPenalties
      }));
    }
  });

  return deck;
}

module.exports = generateDoorDeck;
