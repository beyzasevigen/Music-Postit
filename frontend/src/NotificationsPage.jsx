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

  // mor tema (SongPage ile aynı)
  const UI = {
    cardBg: "rgba(184,156,255,0.08)",
    cardBorder: "rgba(184,156,255,0.18)",
    inputBg: "rgba(15,23,42,0.55)",
    inputBorder: "rgba(184,156,255,0.22)",
    accent: "#b89cff",
    accentText: "#120a1d",
    muted: "#9ca3af",
  };

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
    <div className="page">
      <div className="content" style={{ paddingBottom: 110 }}>
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15 }}>
            Bildirimler
          </div>
          <div style={{ marginTop: 6, color: UI.muted, fontSize: 13 }}>
            Yorumlarına gelen beğeniler
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: UI.cardBg,
            border: `1px solid ${UI.cardBorder}`,
            borderRadius: 18,
            padding: 18,
            backdropFilter: "blur(12px)",
          }}
        >
          {loading && <div style={{ color: UI.muted, fontSize: 14 }}>Yükleniyor...</div>}
          {error && <div style={{ color: "#f97316", fontSize: 14 }}>{error}</div>}

          {!loading && !error && items.length === 0 && (
            <div style={{ color: UI.muted, fontSize: 14 }}>
              Henüz beğeni bildirimin yok.
            </div>
          )}

          <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: 8 }}>
            {items.map((n) => {
              const songId = n.songId ?? n.song?.id;
              const who = n.likedByUsername || "Biri";
              const title = n.songTitle || "bir şarkı";

              const message = `${who}, "${title}" şarkısındaki yorumunu beğendi`;

              return (
                <li
                  key={n.id ?? `${n.noteId}-${n.createdAt ?? ""}`}
                  style={{
                    padding: "14px 0",
                    borderTop: "1px solid rgba(184,156,255,0.16)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, lineHeight: 1.45 }}>{message}</div>
                      <div style={{ marginTop: 6, fontSize: 12, color: UI.muted }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString("tr-TR") : ""}
                      </div>
                    </div>

                    {songId ? (
                      <Link
                        to={`/song/${songId}?mine=true`}
                        style={{
                          textDecoration: "none",
                          fontWeight: 900,
                          fontSize: 13,
                          padding: "8px 12px",
                          borderRadius: 999,
                          border: `1px solid ${UI.inputBorder}`,
                          background: UI.inputBg,
                          color: UI.accent,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Aç →
                      </Link>
                    ) : (
                      <span style={{ color: UI.muted }}>—</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
