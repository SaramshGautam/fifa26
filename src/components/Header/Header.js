import React from "react";
import "./Header.css";

/**
 * App header — shows the tournament branding and the current user with a logout button.
 */
export default function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__trophy" aria-hidden="true">🏆</span>
        <div>
          <h1 className="header__title">FIFA World Cup</h1>
          <span className="header__sub">2026 · USA · Canada · Mexico</span>
        </div>
      </div>

      {user && (
        <div className="header__user">
          <span className="header__username">{user.name || user.username}</span>
          <button
            className="btn btn--outline btn--sm"
            onClick={onLogout}
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
