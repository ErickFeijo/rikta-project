import React, { useEffect, useState } from 'react';
import './TurnTransition.css';

export default function TurnTransition({ playerName, onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(false), 1800); // animação de saída
    const hideTimer = setTimeout(() => onFinish?.(), 2200); // dispara o fim real

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className={`turn-transition ${visible ? 'show' : 'hide'}`}>
      <div className="card">
        <div className="icon">🔁</div>
        <h1>Turno Encerrado</h1>
        <div className="icon">🎲</div>
        <h2>Agora é a vez de <span className="highlight">{playerName}</span>!</h2>
      </div>
    </div>
  );
}
