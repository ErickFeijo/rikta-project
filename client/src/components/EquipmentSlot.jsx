import React from 'react';
import Card from './Card';
import './EquipmentSlot.css'; // Importa o CSS específico para EquipmentSlot

export default function EquipmentSlot({ icon, label, card }) {
  return (
    <div className={`equipment-slot ${card ? 'filled' : ''}`}>
      {card ? (
        <div className="equipment-card-wrapper">
          <Card card={card} />
        </div>
      ) : (
        <>
          <div className="equipment-icon">{icon}</div>
          <div className="equipment-label">{label}</div>
        </>
      )}
    </div>
  );
}
