import React from 'react';
import './Sidebar.css';

export default function Sidebar({ players, playerName, history }) {
  return (
    <aside className="sidebar">
      <section className="players-section">
        <h2>🎮 Jogadores</h2>
        <ul>
          {players.map(p => (
            <li
              key={p.id}
              className={`player-item ${p.username === playerName ? '' : ''} ${p.isTurn ? 'active' : ''}`}
            >
              <div className="player-name">
                {p.username}
                {p.username === playerName && <span className="tag you">você</span>}
                {/* {p.isHost && <span className="tag host">host</span>} */}
                {/* {p.isTurn && <span className="tag turn">🔁 turno</span>} */}
              </div>
              <div className="player-level">Nível {p.level}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="history-section">
        <h2>📝 Histórico</h2>
        <ul className="history-list">
          {history && (
            history.slice(-10).reverse().map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))
          )}
        </ul>
      </section>
    </aside>
  );
}
