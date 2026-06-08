const USERS_KEY    = "wc2026_users";
const SESSION_KEY  = "wc2026_session";

/* ─── User store ──────────────────────────────────────────────── */

/** @returns {{ [username: string]: { password: string, name: string, predictions: object } }} */
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** @returns {{ username: string, name: string } | null} */
export function getUser(username) {
  const users = getUsers();
  return users[username] || null;
}

export function createUser(username, password, name) {
  const users = getUsers();
  if (users[username]) throw new Error("Username already taken.");
  users[username] = { password, name, predictions: {} };
  saveUsers(users);
  return { username, name };
}

export function verifyUser(username, password) {
  const users = getUsers();
  const u = users[username];
  if (!u) throw new Error("User not found.");
  if (u.password !== password) throw new Error("Incorrect password.");
  return { username, name: u.name };
}

export function getUserPredictions(username) {
  const users = getUsers();
  return users[username]?.predictions || {};
}

export function saveUserPredictions(username, predictions) {
  const users = getUsers();
  if (!users[username]) return;
  users[username].predictions = predictions;
  saveUsers(users);
}

/* ─── Session ────────────────────────────────────────────────── */

/** @returns {{ username: string, name: string } | null} */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
