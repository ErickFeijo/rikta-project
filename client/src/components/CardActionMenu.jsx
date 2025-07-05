import React from 'react';
import { socket } from '../socket';
import './CardActionMenu.css';

export default function CardActionMenu({ card, phase, isPlayerTurn, onClose }) {
  const options = [];

  const isInitialSetup = phase === 'initialSetup';
  const isSetup = phase === 'setup';
  const isCombat = phase === 'combat';
  const isNotCurrentTurn = !isPlayerTurn;

  // Equipar carta (initialSetup sempre, setup só se for o turno)
  if (card.type === 'equipment') {
    if (isInitialSetup || (isSetup && isPlayerTurn)) {
      options.push({
        label: 'Equipar',
        action: () => {
          socket.emit('equip_card', { cardId: card.id });
          onClose();
        },
      });
    }
  }

  // Usar efeito (mesmo fora do turno)
  if (card.type === 'effect') {
    options.push({
      label: 'Usar efeito',
      action: () => {
        socket.emit('use_card_effect', { cardId: card.id });
        onClose();
      },
    });
  }

  if (card.type === 'monster' && isCombat && isNotCurrentTurn) {
    options.push({
      label: 'Ajudar Monstro',
      action: () => {
        socket.emit('add_monster_to_combat', {
          cardId: card.id
        });
        onClose();
      }
    });
  }
  // Se não houver ações possíveis, não renderiza o menu
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="card-action-menu">
      {options.map((opt, i) => (
        <button
          key={i}
          className="action-button"
          onClick={opt.action}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
