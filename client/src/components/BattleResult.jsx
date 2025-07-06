import React, { useEffect, useState } from 'react';
import './BattleResult.css';

export default function BattleResult({ result, onClose, playerName }) {
  const [phase, setPhase] = useState('showdown');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('result'), 3000);
    const timer2 = setTimeout(() => setPhase('consequences'), 7500);
    const timer3 = setTimeout(() => {
      onClose();
    }, 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onClose]);

  const isAttacker = result.data.attacker === playerName;
  const isVictory = result.data.outcome === 'win';
  const isDefeat = result.data.outcome === 'lose';
  const isDraw = result.data.outcome === 'draw';

  return (
    <div className="flee-overlay">
      {phase === 'showdown' && (
        <div className="flee-instruction">
          ⚔️ {isAttacker ? 'Você entrou em combate!' : `${result.data.attacker} iniciou um combate!`}<br />
        </div>
      )}

      {phase === 'result' && (
        <>
          <div className="battle-stats">
            <div>👤 {result.data.attacker}: <strong>{result.data.attackerPower}</strong></div>
            <div>👾 {result.data.monster}: <strong>{result.data.monsterPower}</strong></div>
          </div>
          <div
            className={`result-text ${
              isVictory ? 'success' : isDefeat ? 'failure' : 'draw'
            }`}
          >
            {result.data.message}
          </div>
        </>
      )}

      {phase === 'consequences' && (
        <>
          {isVictory && (
            <div className="effect-phase">
              <div className="effect-title">🏆 Recompensas</div>
              <div className="effect-text effect-good">
                {result.data.rewards[0]?.message || 'Sem recompensas.'}
              </div>
            </div>
          )}
          {isDefeat && (
            <div className="effect-phase">
              <div className="effect-title">💀 Penalidades</div>
              <div className="effect-text effect-bad">
                {result.data.penalties[0]?.message || 'Sem penalidades.'}
              </div>
            </div>
          )}
          {isDraw && (
            <div className="effect-phase">
              <div className="effect-title">🤝 Empate</div>
              <div className="effect-text">
                {result.data.drawMessage || 'Nada acontece.'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
