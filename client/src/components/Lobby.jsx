import React from "react";
import "./Lobby.css";

export default function Lobby({
  room,
  players,
  currentPlayer,
  isHost,
  onStartGame,
}) {
  return (
    <div className="waitingroom-container">
      <header className="waitingroom-header">
        <h2>Sala: {room}</h2>
        <p>Aguardando jogadores para começar...</p>
      </header>

      <section className="player-list" aria-label="Lista de jogadores">
        <h3>Jogadores na sala</h3>
        <ul>
          {players.map((player) => (
            <li
              key={player.id}
              className={player.name === currentPlayer ? "current-player" : ""}
            >
              {player.name} {player.name === currentPlayer && " (Você)"}
              {isHost && player.isHost && " ★"}
            </li>
          ))}
        </ul>
      </section>

      {isHost && (
        <button
          className="start-game-btn"
          disabled={players.length < 2}
          onClick={onStartGame}
          aria-disabled={players.length < 2}
        >
          Iniciar Jogo
        </button>
      )}
    </div>
  );
}
