import React, { useState, useRef, useEffect } from 'react';
import CardStack from './CardStack';
import Card from './Card';
import './PlayerSide.css';

export default function PlayerSide({ mainPlayer, helperPlayer}) {
  const [showDetail, setShowDetail] = useState(false);
  const [detailCards, setDetailCards] = useState([]);
  const detailRef = useRef(null);

  // Fecha o card detail ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        setShowDetail(false);
      }
    }

    if (showDetail) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetail]);

  const handleCardClick = (cards) => {
    setDetailCards(cards);
    setShowDetail(true);
  };

  return (
    <>
      <div className="player-side-content">
        {mainPlayer && (
          <div className="side-holder" onClick={() => handleCardClick(mainPlayer.equippedCards)}>
            <div className="holder-label">{mainPlayer.username}</div>
            <CardStack cards={mainPlayer.equippedCards} />
            <div className="total-label">
              Bônus: <span className="bonus-value">+{mainPlayer.power}</span>
            </div>
          </div>
        )}

        {helperPlayer && (
          <div className="side-holder" onClick={() => handleCardClick(helperPlayer.equippedCards)}>
            <div className="holder-label">{helperPlayer.username} (Ajudante)</div>
            <CardStack cards={helperPlayer.equippedCards} />
            <div className="total-label">
              Bônus: <span className="bonus-value">+{helperPlayer.power}</span>
            </div>
          </div>
        )}
      </div>

      {showDetail && (
        <div className="card-detail-box" ref={detailRef}>
          <div className="card-detail-header">
            <strong>Cartas Equipadas</strong>
            <span onClick={() => setShowDetail(false)} style={{ cursor: 'pointer' }}>❌</span>
          </div>
          <div className="card-list">
            {detailCards.map((card, index) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
