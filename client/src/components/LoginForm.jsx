import React from "react";
import "./LoginForm.css";

export default function LoginForm({ username, setUsername, room, setRoom, onJoin }) {
  const canJoin = username.trim().length >= 3 && room.trim().length >= 3;

  return (
    <div className="app-container">
      <div className="login-form-container">
        
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (canJoin) onJoin();
          }}
        >
          <h1>Entrar em uma Sala</h1>
          <input
            type="text"
            placeholder="Seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <input
            type="text"
            placeholder="Nome da sala"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            maxLength={30}
          />
          <button type="submit" disabled={!canJoin}>
            Entrar na Sala
          </button>
        </form>
      </div>
    </div>
  );
}
