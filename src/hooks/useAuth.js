import { useState, useEffect } from "react";
import {
  getSession,
  saveSession,
  clearSession,
  createUser,
  verifyUser,
  getUserPredictions,
} from "../utils/storage";

/**
 * useAuth — manages login, signup, logout, and the current user session.
 *
 * Returns:
 *   user          — { username, name } | null
 *   initialPreds  — predictions loaded from storage on login
 *   login(u, p)   — sign in; throws on failure
 *   signup(u,p,n) — register then sign in; throws on failure
 *   logout()      — clear session
 */
export function useAuth() {
  const [user, setUser]               = useState(null);
  const [initialPreds, setInitialPreds] = useState({});

  /* Restore session on mount */
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      setInitialPreds(getUserPredictions(session.username));
    }
  }, []);

  const login = (username, password) => {
    const u = verifyUser(username, password);   // throws on bad creds
    saveSession(u);
    setUser(u);
    setInitialPreds(getUserPredictions(u.username));
  };

  const signup = (username, password, name) => {
    const u = createUser(username, password, name); // throws if taken
    saveSession(u);
    setUser(u);
    setInitialPreds({});
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setInitialPreds({});
  };

  return { user, initialPreds, login, signup, logout };
}
