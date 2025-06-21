import React from 'react';

export default function PlayerList({ players }) {
  return (
    <aside className="sidebar">
      <h2>Jogadores</h2>
      <ul>
        {players.map(p => (
          <li key={p.id}>
            <strong>{p.username}{p.isHost && ' ⭐'}</strong> — Nível <strong>{p.level}</strong>
            {p.isTurn && ' 🎯'}
          </li>
        ))}
      </ul>
    </aside>
  );
}