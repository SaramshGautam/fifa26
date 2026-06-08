import React, { useState } from "react";
import "./LoginPage.css";

/**
 * LoginPage — handles sign-in and sign-up in one view.
 * Calls onLogin(username, password) or onSignup(username, password, name).
 */
export default function LoginPage({ onLogin, onSignup }) {
  const [mode, setMode]   = useState("login"); // "login" | "signup"
  const [form, setForm]   = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.username.trim() || !form.password.trim()) {
      return setError("Username and password are required.");
    }
    if (mode === "signup" && !form.name.trim()) {
      return setError("Please enter your full name.");
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        onSignup(form.username.trim(), form.password, form.name.trim());
      } else {
        onLogin(form.username.trim(), form.password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Branding */}
        <div className="login-card__hero">
          <span className="login-card__trophy" aria-hidden="true">🏆</span>
          <h1 className="login-card__title">FIFA World Cup</h1>
          <p className="login-card__subtitle">2026 · USA · Canada · Mexico</p>
        </div>

        {/* Mode heading */}
        <h2 className="login-card__form-title">
          {mode === "login" ? "Sign in to your bracket" : "Create your bracket"}
        </h2>

        {/* Form fields */}
        {mode === "signup" && (
          <div className="field">
            <label className="field__label" htmlFor="name">Full name</label>
            <input
              id="name"
              className="field__input"
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
              onKeyDown={handleKeyDown}
              autoComplete="name"
            />
          </div>
        )}

        <div className="field">
          <label className="field__label" htmlFor="username">Username</label>
          <input
            id="username"
            className="field__input"
            placeholder="username"
            value={form.username}
            onChange={update("username")}
            onKeyDown={handleKeyDown}
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="field__input"
            placeholder="••••••••"
            value={form.password}
            onChange={update("password")}
            onKeyDown={handleKeyDown}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && <p className="login-card__error" role="alert">{error}</p>}

        <button
          className="btn btn--gold btn--lg login-card__submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p className="login-card__switch">
          {mode === "login" ? "No account? " : "Already registered? "}
          <button className="login-card__switch-btn" onClick={toggleMode}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
