import React from 'react';
import "./Lobby.css";

export default function PlayerList({ players }) {
  return (
    <ul className="space-y-1 list-disc list-inside mb-4">
      {players.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  );
}
