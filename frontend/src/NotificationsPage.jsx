import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuthHeader } from "./auth";
import BottomNav from "./BottomNav";

const API_BASE = "http://localhost:8080";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const auth = getAuthHeader();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  useEffect(() => {
    if (!auth) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/api/notifications/likes`, {
          headers: { Authorization: auth },
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Bildirimler alınamadı (${res.status})`);
        }

        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError(
          "Bildirimler yüklenemedi. Backend'de /api/notifications/likes endpoint'i yoksa eklememiz gerekecek."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [auth]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.title}>Bildirimler</div>
        <div style={styles.sub}>Yorumlarına gelen beğeniler</div>
      </div>

      <div style={styles.card}>
        {loading && <div style={styles.muted}>Yükleniyor...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div style={styles.muted}>Henüz beğeni bildirimin yok.</div>
        )}

        <ul style={styles.list}>
          {items.map((n) => {
            const songId = n.songId ?? n.song?.id;
            return (
              <li key={n.id ?? `${n.noteId}-${n.createdAt ?? ""}`} style={styles.item}>
                <div style={styles.row}>
                  <div>
                    <div style={styles.line}>
                      <b>{n.likerUsername ?? "Biri"}</b> yorumunu beğendi
                    </div>
                    <div style={styles.meta}>
                      {n.songTitle ? `Şarkı: ${n.songTitle}` : "Şarkı bilgisi yok"}
                    </div>
                  </div>

                  {songId ? (
                    <Link to={`/song/${songId}`} style={styles.open}>
                      Aç →
                    </Link>
                  ) : (
                    <span style={styles.muted}>—</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
    padding: "32px",
    paddingBottom: 110, // alt menü boşluğu
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: { marginBottom: 14 },
  title: { fontSize: 22, fontWeight: 900 },
  sub: { marginTop: 4, color: "#9ca3af", fontSize: 13 },
  card: {
    background: "#030712",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 18,
  },
  muted: { color: "#6b7280", fontSize: 14 },
  error: { color: "#f97316", fontSize: 14 },
  list: { listStyle: "none", padding: 0, margin: 0, marginTop: 8 },
  item: { borderTop: "1px solid #1f2937", padding: "12px 0" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  line: { fontSize: 14 },
  meta: { marginTop: 4, fontSize: 12, color: "#9ca3af" },
  open: { color: "#38bdf8", textDecoration: "none", fontWeight: 800 },
};
