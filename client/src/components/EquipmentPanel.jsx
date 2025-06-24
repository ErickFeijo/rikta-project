import React from 'react';
import EquipmentSlot from './EquipmentSlot';

export default function EquipmentPanel({ equipment, classeCard, squireCard }) {
  const totalBonus = Object.values(equipment)
    .filter(Boolean)
    .reduce((sum, card) => sum + (card.bonus || 0), 0);

  return (
    <div className="equipment-tab">
      <input type="checkbox" id="toggle-equipment" className="toggle-equipment" />
      <label htmlFor="toggle-equipment" className="equipment-label">⚙️ Equipado</label>
      <div className="equipment-panel">

        <div className="equipment-bonus">Bônus: +{totalBonus}</div>

        {/* Slots fixos no canto superior e inferior direito */}
        <div className="equipment-slot-top-right">
          <EquipmentSlot icon="🏅" label="Classe" card={classeCard} />
        </div>
        <div className="equipment-slot-bottom-right">
          <EquipmentSlot icon="🛡️" label="Escudeiro" card={squireCard} />
        </div>

        <div className="equipment-layout">
          <div className="hand-slot left-hand">
            <EquipmentSlot icon="🖐️" label="Mão Esq." card={equipment.leftHand} />
          </div>
          <div className="body-slots">
            <EquipmentSlot icon="🪖" label="Elmo" card={equipment.head} />
            <EquipmentSlot icon="🦺" label="Armadura" card={equipment.body} />
            <EquipmentSlot icon="🦺" label="Calça" card={equipment.legs} />
            <EquipmentSlot icon="🥾" label="Botas" card={equipment.feet} />
          </div>
          <div className="hand-slot right-hand">
            <EquipmentSlot icon="✋" label="Mão Dir." card={equipment.rightHand} />
          </div>
        </div>
      </div>
    </div>
  );
}
