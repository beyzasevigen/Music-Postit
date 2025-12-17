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

  const testLogin = async () => {
    setLoading(true);
    setMsg("");

    try {
      // ✅ Backend’te auth gerektiren kolay bir endpoint’i test ediyoruz
      const res = await fetch(`${API_BASE}/api/songs/1`, {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (!res.ok) {
        setMsg("Giriş başarısız. Kullanıcı adı/şifre yanlış olabilir.");
        return;
      }

      // ✅ başarılıysa kaydet
      setAuth(username, password);
      setMsg("Giriş başarılı ✅");

      setTimeout(() => navigate("/"), 500);
    } catch (e) {
      console.error(e);
      setMsg("Sunucuya bağlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Login</div>
        <div style={styles.subtitle}>
          Basic Auth kullanıyoruz. Login butonu bilgileri kaydeder ve isteklerde otomatik kullanılır.
        </div>

        {msg && <div style={styles.msg}>{msg}</div>}

        <div style={styles.box}>
          <div style={styles.row}>
            <label style={styles.label}>Username (veya email)</label>
            <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={testLogin} disabled={loading}>
            {loading ? "Kontrol ediliyor..." : "Login"}
          </button>
        </div>

        <div style={styles.footer}>
          Hesabın yok mu?{" "}
          <Link to="/register" style={styles.link}>
            Register
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
    width: "min(560px, 92vw)",
    background: "#0b1222",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
  },
  title: { fontSize: 26, fontWeight: 800 },
  subtitle: { color: "#9ca3af", marginTop: 6, marginBottom: 14 },
  msg: {
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
    background: "rgba(96,165,250,0.12)",
    border: "1px solid rgba(96,165,250,0.25)",
  },
  box: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: 14,
  },
  row: { display: "grid", gap: 6, marginBottom: 10 },
  label: { fontSize: 13, color: "#cbd5e1" },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0b1222",
    color: "#e5e7eb",
    outline: "none",
  },
  button: {
    marginTop: 6,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "#000",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
  },
  footer: { marginTop: 14, color: "#9ca3af", fontSize: 14 },
  link: { color: "#60a5fa", textDecoration: "none", fontWeight: 700 },
  back: { color: "#93c5fd", textDecoration: "none", fontSize: 14 },
};
