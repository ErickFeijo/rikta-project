import React from 'react';
import './Card.css';

export default function Card({ card, showButton = false, onClick, compact = false }) {
  return (
    <div className={`card-container ${compact ? 'card-compact' : ''}`} title={card.description}>
      <div className="card-background" />
      <div className="card-content">
        {compact ? (
          <div className="card-eye-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2c1800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        ) : (
          <>
            <div>
              <div className="card-title">{card.name}</div>
              <div className="card-details">{card.description}</div>
            </div>
            {card.bonus && (
              <div className="card-bonus">+{card.bonus}</div>
            )}
            {showButton && (
              <button onClick={onClick}>Equipar</button>
            )}
          </>
        )}
      </div>
    </div>

  );
}
