import React, { useEffect, useState } from 'react';
import './FleeAttemptResult.css';

export default function FleeAttemptResult({ result, onClose, playerName }) {
  const [phase, setPhase] = useState('rolling');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('result'), 5000);
    const timer2 = setTimeout(() => {
      if (result.escaped) {
        onClose();
      } else {
        setPhase('effect');
      }
    }, 8000);
    const timer3 = setTimeout(() => {
      if (!result.escaped) {
        onClose();
      }
    }, 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [result.escaped, onClose]);

  const isFleePlayer = result.username === playerName;
  const isSuccess = result.escaped;

  return (
    <div className="flee-overlay">
      {phase === 'rolling' && (
        <>
          <div className="flee-instruction">
            🎲 <strong>
              {isFleePlayer
                ? 'Você está tentando fugir!'
                : `${result.username} está tentando fugir!`}
            </strong><br />
            Se tirar <strong>5 ou 6</strong>, {isFleePlayer ? 'você escapa' : 'ele/ela escapa'} do monstro!
          </div>
          <div className="dice rolling"></div>
        </>
      )}

      {phase === 'result' && (
        <>
          <div className="dice">{result.roll}</div>
          <div className={`result-text ${isSuccess ? 'success' : 'failure'}`}>
            {result.message}
          </div>
        </>
      )}

      {phase === 'effect' && !isSuccess && (
        <div className="effect-phase">
          <div className="effect-title">🎭 Aplicando efeitos da carta...</div>
          <div className={`effect-text effect-bad`}>
            {result.penalties?.message || 'Sem penalidade.'}
          </div>
        </div>
      )}
    </div>
  );
}
