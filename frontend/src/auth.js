export function setAuth(username, password) {
  localStorage.setItem("auth_username", username);
  localStorage.setItem("auth_password", password);
}

export function getAuthHeader() {
  const u = localStorage.getItem("auth_username");
  const p = localStorage.getItem("auth_password");
  if (!u || !p) return null;
  return "Basic " + btoa(`${u}:${p}`);
}

export function clearAuth() {
  localStorage.removeItem("auth_username");
  localStorage.removeItem("auth_password");
}
