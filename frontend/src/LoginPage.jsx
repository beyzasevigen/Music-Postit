import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from "./auth";

const API_BASE = "http://localhost:8080";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("beyza");
  const [password, setPassword] = useState("secret");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const UI = {
    cardBg: "rgba(184,156,255,0.08)",
    cardBorder: "rgba(184,156,255,0.18)",
    inputBg: "rgba(15,23,42,0.55)",
    inputBorder: "rgba(184,156,255,0.22)",
    accent: "#b89cff",
    accentText: "#120a1d",
    muted: "#9ca3af",
  };

  const testLogin = async () => {
    setLoading(true);
    setMsg("");

    try {
      // We test an authenticated endpoint to verify credentials
      const res = await fetch(`${API_BASE}/api/songs/1`, {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (!res.ok) {
        setMsg("Login failed. Your username/password might be incorrect.");
        return;
      }

      setAuth(username, password);
      try {
  const meRes = await fetch(`${API_BASE}/api/users/me`, {
    headers: { Authorization: "Basic " + btoa(`${username}:${password}`) },
  });

  if (meRes.ok) {
    const me = await meRes.json();
    localStorage.setItem("auth_userId", String(me.id || ""));
    localStorage.setItem("auth_username", me.username || username || "");
    localStorage.setItem("auth_avatar", me.imageUrl || "");
    localStorage.setItem("auth_email", me.email || "");
  } else {
    // fallback
    localStorage.setItem("auth_username", username || "");
    localStorage.setItem("auth_avatar", "");
  }
} catch {
  localStorage.setItem("auth_username", username || "");
  localStorage.setItem("auth_avatar", "");
}

      
      localStorage.setItem("auth_username", username || "");

      setMsg("Login successful ✅");
      setTimeout(() => navigate("/"), 450);
    } catch (e) {
      console.error(e);
      setMsg("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="content" style={styles.content}>
        <div style={{ ...styles.card, background: UI.cardBg, border: `1px solid ${UI.cardBorder}` }}>
          <div style={styles.title}>Login</div>
          <div style={{ ...styles.subtitle, color: UI.muted }}>
            We use Basic Auth. Clicking Login stores your credentials and uses them automatically in requests.
          </div>

          {msg && (
            <div
              style={{
                ...styles.msg,
                background: "rgba(184,156,255,0.12)",
                border: "1px solid rgba(184,156,255,0.25)",
                color: "#eae7f2",
              }}
            >
              {msg}
            </div>
          )}

          <div
            style={{
              ...styles.box,
              background: UI.inputBg,
              border: `1px solid ${UI.inputBorder}`,
            }}
          >
            <div style={styles.row}>
              <label style={{ ...styles.label, color: "#c7c2d6" }}>
                Username (or email)
              </label>
              <input
                style={{
                  ...styles.input,
                  background: "rgba(15,23,42,0.65)",
                  border: `1px solid ${UI.inputBorder}`,
                  color: "#eae7f2",
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div style={styles.row}>
              <label style={{ ...styles.label, color: "#c7c2d6" }}>Password</label>
              <input
                style={{
                  ...styles.input,
                  background: "rgba(15,23,42,0.65)",
                  border: `1px solid ${UI.inputBorder}`,
                  color: "#eae7f2",
                }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              style={{
                ...styles.button,
                background: UI.accent,
                color: UI.accentText,
              }}
              onClick={testLogin}
              disabled={loading}
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </div>

          <div style={{ ...styles.footer, color: UI.muted }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ ...styles.link, color: UI.accent }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    paddingBottom: 40,
    display: "grid",
    placeItems: "center",
    minHeight: "100vh",
  },
  card: {
    width: "min(560px, 92vw)",
    borderRadius: 18,
    padding: 22,
    backdropFilter: "blur(12px)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
  },
  title: { fontSize: 28, fontWeight: 900 },
  subtitle: { marginTop: 8, marginBottom: 14, fontSize: 13, lineHeight: 1.5 },
  msg: {
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  box: {
    borderRadius: 16,
    padding: 14,
  },
  row: { display: "grid", gap: 6, marginBottom: 10 },
  label: { fontSize: 13, fontWeight: 800 },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    outline: "none",
  },
  button: {
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
    width: "100%",
  },
  footer: { marginTop: 14, fontSize: 14 },
  link: { textDecoration: "none", fontWeight: 900 },
};
