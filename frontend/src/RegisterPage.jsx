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

  const validate = () => {
    if (!username.trim()) return "Kullanıcı adı zorunlu.";
    if (username.trim().length < 3) return "Kullanıcı adı en az 3 karakter olmalı.";
    if (!email.trim()) return "Email zorunlu.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Geçerli bir email gir.";
    if (!password) return "Şifre zorunlu.";
    if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
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

      const text = await res.text(); // backend string döndürüyor

      if (!res.ok) {
        setMsg({ type: "error", text: text || `Kayıt başarısız (${res.status})` });
        return;
      }

      setMsg({ type: "success", text: text || "Kayıt başarılı. Login sayfasına yönlendiriliyorsun..." });

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (e2) {
      console.error(e2);
      setMsg({ type: "error", text: "Sunucuya bağlanırken hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>Register</div>
          <div style={styles.subtitle}>Music Post-it hesabını oluştur</div>
        </div>

        {msg.text && (
          <div
            style={{
              ...styles.msg,
              ...(msg.type === "success" ? styles.msgSuccess : styles.msgError),
            }}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="beyza"
            autoComplete="username"
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="beyza@example.com"
            autoComplete="email"
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            autoComplete="new-password"
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kayıt ol"}
          </button>
        </form>

        <div style={styles.footer}>
          Zaten hesabın var mı?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>

        <div style={{ marginTop: 10 }}>
          <Link to="/" style={styles.back}>
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#020617",
    color: "#e5e7eb",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: 20,
  },
  card: {
    width: "min(520px, 92vw)",
    background: "#0b1222",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
  },
  header: { marginBottom: 14 },
  title: { fontSize: 26, fontWeight: 800 },
  subtitle: { color: "#9ca3af", marginTop: 6 },
  msg: {
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 14,
    border: "1px solid transparent",
  },
  msgSuccess: { background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.3)" },
  msgError: { background: "rgba(249,115,22,0.12)", borderColor: "rgba(249,115,22,0.3)" },
  form: { display: "grid", gap: 10 },
  label: { fontSize: 13, color: "#cbd5e1" },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#e5e7eb",
    outline: "none",
  },
  button: {
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "#000",
    fontWeight: 800,
    cursor: "pointer",
  },
  footer: { marginTop: 14, color: "#9ca3af", fontSize: 14 },
  link: { color: "#60a5fa", textDecoration: "none", fontWeight: 700 },
  back: { color: "#93c5fd", textDecoration: "none", fontSize: 14 },
};
