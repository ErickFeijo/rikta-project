import React from 'react';
import CardStack from './CardStack';
import './PlayerSide.css';

export default function PlayerSide({ mainPlayer, helperPlayer, isPlayerTurn, onHelp }) {
  return (
    <>
      {!isPlayerTurn && mainPlayer && !helperPlayer && (
        <div className="side-button-wrapper">
          <button className="help-button" onClick={onHelp}>
            🙌 Ajudar {mainPlayer.username}
          </button>
        </div>
      )}

      <div className="player-side-content">
        {mainPlayer && (
          <div className="side-holder">
            <div className="holder-label">{mainPlayer.username}</div>
            <CardStack cards={mainPlayer.equippedCards} />
            <div className="total-label">
              Bônus: <span className="bonus-value">+{mainPlayer.power}</span>
            </div>
          </div>
        )}

        {helperPlayer && (
          <div className="side-holder">
            <div className="holder-label">{helperPlayer.username} (Ajudante)</div>
            <CardStack cards={helperPlayer.equippedCards} />
            <div className="total-label">
              Bônus: <span className="bonus-value">+{helperPlayer.power}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
