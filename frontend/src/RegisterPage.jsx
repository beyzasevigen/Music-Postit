import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const UI = {
    cardBg: "rgba(184,156,255,0.08)",
    cardBorder: "rgba(184,156,255,0.18)",
    inputBg: "rgba(15,23,42,0.6)",
    inputBorder: "rgba(184,156,255,0.22)",
    accent: "#b89cff",
    muted: "#9ca3af",
    success: "rgba(34,197,94,0.18)",
    error: "rgba(249,115,22,0.18)",
  };

  const validate = () => {
    if (!username.trim()) return "Username is required.";
    if (username.trim().length < 3)
      return "Username must be at least 3 characters.";
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6)
      return "Password must be at least 6 characters.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        setMsg({
          type: "error",
          text: text || `Registration failed (${res.status})`,
        });
        return;
      }

      setMsg({
        type: "success",
        text: text || "Registration successful. Redirecting to login…",
      });

      setTimeout(() => navigate("/login"), 700);
    } catch (e2) {
      console.error(e2);
      setMsg({
        type: "error",
        text: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="content" style={styles.content}>
        <div
          style={{
            ...styles.card,
            background: UI.cardBg,
            border: `1px solid ${UI.cardBorder}`,
          }}
        >
          <div style={styles.header}>
            <div style={styles.title}>Create account</div>
            <div style={{ ...styles.subtitle, color: UI.muted }}>
              Join Music PostIt and start saving notes on songs
            </div>
          </div>

          {msg.text && (
            <div
              style={{
                ...styles.msg,
                background:
                  msg.type === "success" ? UI.success : UI.error,
                border: `1px solid ${
                  msg.type === "success"
                    ? "rgba(34,197,94,0.35)"
                    : "rgba(249,115,22,0.35)"
                }`,
              }}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={onSubmit} style={styles.form}>
            <label style={styles.label}>Username</label>
            <input
              style={{
                ...styles.input,
                background: UI.inputBg,
                border: `1px solid ${UI.inputBorder}`,
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="beyza"
              autoComplete="username"
            />

            <label style={styles.label}>Email</label>
            <input
              style={{
                ...styles.input,
                background: UI.inputBg,
                border: `1px solid ${UI.inputBorder}`,
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="beyza@example.com"
              autoComplete="email"
            />

            <label style={styles.label}>Password</label>
            <input
              style={{
                ...styles.input,
                background: UI.inputBg,
                border: `1px solid ${UI.inputBorder}`,
              }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="new-password"
            />

            <button
              style={{
                ...styles.button,
                background: UI.accent,
                color: "#120a1d",
              }}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <div style={{ ...styles.footer, color: UI.muted }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ ...styles.link, color: UI.accent }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  card: {
    width: "min(520px, 92vw)",
    borderRadius: 18,
    padding: 22,
    backdropFilter: "blur(12px)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
  },
  header: { marginBottom: 14 },
  title: { fontSize: 28, fontWeight: 900 },
  subtitle: { marginTop: 6, fontSize: 13 },
  msg: {
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 14,
  },
  form: { display: "grid", gap: 10 },
  label: { fontSize: 13, fontWeight: 800, color: "#c7c2d6" },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    color: "#eae7f2",
    outline: "none",
  },
  button: {
    marginTop: 10,
    padding: "10px 14px",
    borderRadius: 999,
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
  },
  footer: { marginTop: 14, fontSize: 14 },
  link: { textDecoration: "none", fontWeight: 900 },
};
