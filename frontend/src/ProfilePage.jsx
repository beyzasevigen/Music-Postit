import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthHeader } from "./auth";
import BottomNav from "./BottomNav";

const API_BASE = "http://localhost:8080";

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = getAuthHeader();

  const [me, setMe] = useState({ username: "", email: "", imageUrl: "" });

  // ✅ Dinleme geçmişi
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Postitlerim
  const [postitTab, setPostitTab] = useState("public"); // "public" | "private"
  const [postitSongs, setPostitSongs] = useState([]);
  const [postitLoading, setPostitLoading] = useState(false);
  const [postitError, setPostitError] = useState("");

  // ✅ Profil düzenleme
  const [editOpen, setEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // 🎨 tek yerden tema
  const UI = {
    cardBg: "rgba(184,156,255,0.08)",
    cardBorder: "rgba(184,156,255,0.18)",
    inputBg: "rgba(15,23,42,0.55)",
    inputBorder: "rgba(184,156,255,0.22)",
    accent: "#b89cff",
    accentText: "#120a1d",
    muted: "#9ca3af",
    muted2: "#6b7280",
  };

  // ✅ auth yoksa login
  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  // ✅ Profil + dinleme geçmişi yükle
  useEffect(() => {
    if (!auth) return;

    const load = async () => {
      setLoading(true);
      setError("");

      // 1) Me
      try {
        const meRes = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: auth },
        });
        if (!meRes.ok) throw new Error("Me bilgisi alınamadı");

        const meData = await meRes.json();

        setMe({
          username: meData.username || "",
          email: meData.email || "",
          imageUrl: meData.imageUrl || "",
        });

        localStorage.setItem("auth_userId", String(meData.id || ""));
        localStorage.setItem("auth_username", meData.username || "");
        localStorage.setItem("auth_email", meData.email || "");
      } catch (e) {
        console.error(e);
      }

      // 2) Play history
      try {
        const res = await fetch(`${API_BASE}/api/play-history/me/recent-songs`, {
          headers: { Authorization: auth },
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Play history alınamadı (${res.status})`);
        }

        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (e2) {
        console.error(e2);
        setError("Dinleme geçmişi yüklenemedi. Endpoint adını kontrol edelim.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [auth]);

  const saveProfile = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        username: editUsername,
        imageUrl: editImageUrl,
      }),
    });

    if (!res.ok) throw new Error("Profil güncellenemedi");

    // UI'ı güncelle
    setMe((prev) => ({
      ...prev,
      username: editUsername,
      imageUrl: editImageUrl,
    }));

    // ✅ localStorage GÜNCELLEMELERİ BURADA
    localStorage.setItem("auth_username", editUsername || "");
    localStorage.setItem("auth_avatar", editImageUrl || "");

    setEditOpen(false);
  } catch (e) {
    alert("Profil güncellenirken hata oluştu");
    console.error(e);
  }
};



  // ✅ Postitlerim şarkı listesi çek
  const loadPostits = async (tab) => {
    if (!auth) return;

    setPostitLoading(true);
    setPostitError("");

    try {
      const res = await fetch(`${API_BASE}/api/notes/mine`, {
        headers: { Authorization: auth },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `notes/mine alınamadı (${res.status})`);
      }

      const notesData = await res.json();
      const allNotes = Array.isArray(notesData) ? notesData : [];

      const wantPublic = tab === "public";
      const filtered = allNotes.filter((n) => n.isPublic === wantPublic);

      const songIds = Array.from(
        new Set(filtered.map((n) => n.songId).filter(Boolean))
      );

      const songs = await Promise.all(
        songIds.map(async (sid) => {
          const sr = await fetch(`${API_BASE}/api/songs/${sid}`, {
            headers: { Authorization: auth },
          });
          if (!sr.ok) return null;

          const s = await sr.json();
          return {
            id: sid,
            title: s.title ?? "Song",
            artist: s.artist ?? "",
            imageUrl: s.coverUrl ?? "",
          };
        })
      );

      setPostitSongs(songs.filter(Boolean));
    } catch (e) {
      console.error(e);
      setPostitSongs([]);
      setPostitError("Postitler yüklenemedi.");
    } finally {
      setPostitLoading(false);
    }
  };

  const logout = () => {
  // auth bilgilerini temizle
  localStorage.removeItem("auth_basic");
  localStorage.removeItem("auth_username");
  localStorage.removeItem("auth_userId");
  localStorage.removeItem("auth_email");
  localStorage.removeItem("auth_avatar");

  navigate("/login");
};


  useEffect(() => {
    if (!auth) return;
    loadPostits(postitTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postitTab, auth]);

  const styles = {
    // sayfa artık global theme ile uyumlu: page/content
    content: { paddingBottom: 110 },

    card: {
      background: UI.cardBg,
      border: `1px solid ${UI.cardBorder}`,
      borderRadius: 18,
      padding: 18,
      backdropFilter: "blur(12px)",
    },

    profileRow: { display: "flex", gap: 14, alignItems: "center" },
    avatar: { width: 84, height: 84, borderRadius: "50%", objectFit: "cover" },
    name: { fontSize: 22, fontWeight: 900 },
    email: { color: UI.muted, marginTop: 4, fontSize: 14 },

    sectionTitle: { fontSize: 18, fontWeight: 900, marginBottom: 12 },
    muted: { color: UI.muted2, fontSize: 14 },
    error: { color: "#f97316", fontSize: 14 },

    // butonlar / tablar mor
    pill: {
      padding: "7px 12px",
      borderRadius: 999,
      border: `1px solid ${UI.inputBorder}`,
      background: UI.inputBg,
      color: UI.accent,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 900,
    },

    tabRow: { display: "flex", gap: 10, marginBottom: 12 },
    tabBtn: {
      padding: "7px 12px",
      borderRadius: 999,
      border: `1px solid ${UI.inputBorder}`,
      background: UI.inputBg,
      color: UI.muted,
      cursor: "pointer",
      fontWeight: 900,
      fontSize: 12,
    },
    tabActive: { background: UI.accent, color: UI.accentText, border: "none" },

    input: {
      width: "100%",
      marginTop: 6,
      padding: "8px 10px",
      borderRadius: 12,
      border: `1px solid ${UI.inputBorder}`,
      background: UI.inputBg,
      color: "#e5e7eb",
      outline: "none",
    },

    // list item’ları “cam kart” gibi
    list: { listStyle: "none", padding: 0, margin: 0, marginTop: 8 },
    item: {
      borderTop: "1px solid rgba(184,156,255,0.16)",
    },
    itemLink: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "14px 0",
      textDecoration: "none",
      color: "#e5e7eb",
    },
    cover: { width: 44, height: 44, borderRadius: 12, objectFit: "cover" },
    songTitle: { fontWeight: 800 },
    songMeta: { fontSize: 13, color: UI.muted },
    chev: { color: "rgba(184,156,255,0.45)", fontSize: 22, lineHeight: 1 },
  };

  return (
    <div className="page">
      <div className="content" style={styles.content}>
        {/* Profil kartı */}
        <div style={styles.card}>
          <div style={styles.profileRow}>
            <img
              src={me.imageUrl || "https://placehold.co/84x84"}
              alt="avatar"
              style={styles.avatar}
            />
            <div>
              <div style={styles.name}>{me.username || "User"}</div>
              <div style={styles.email}>{me.email || "—"}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditUsername(me.username);
            setEditImageUrl(me.imageUrl || "");
            setEditOpen(true);
          }}
          style={{ ...styles.pill, marginTop: 12 }}
        >
          Update Your Profile
        </button>

        {editOpen && (
          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.sectionTitle}>Update Your Profile</div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: UI.muted }}>Username</label>
              <input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: UI.muted }}>Profile photo URL</label>
              <input
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://..."
                style={styles.input}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={saveProfile}
                style={{
                  ...styles.pill,
                  background: UI.accent,
                  color: UI.accentText,
                  border: "none",
                }}
              >
                Save
              </button>

              <button
                onClick={() => setEditOpen(false)}
                style={{ ...styles.pill, color: UI.muted }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Postitlerim */}
        <div style={{ ...styles.card, marginTop: 18 }}>
          <div style={styles.sectionTitle}>My Post-Its💜</div>

          <div style={styles.tabRow}>
            <button
              onClick={() => setPostitTab("public")}
              style={{
                ...styles.tabBtn,
                ...(postitTab === "public" ? styles.tabActive : {}),
              }}
            >
              Public
            </button>
            <button
              onClick={() => setPostitTab("private")}
              style={{
                ...styles.tabBtn,
                ...(postitTab === "private" ? styles.tabActive : {}),
              }}
            >
              Private
            </button>
          </div>

          {postitLoading && <div style={styles.muted}>Loading...</div>}
          {postitError && <div style={styles.error}>{postitError}</div>}

          {!postitLoading && !postitError && postitSongs.length === 0 && (
            <div style={styles.muted}>There is no post-it for now.</div>
          )}

          <ul style={styles.list}>
            {postitSongs.map((s, idx) => {
              const songId = s.id;
              if (!songId) return null;

              return (
                <li key={`${songId}-${idx}`} style={styles.item}>
                  <Link
                    to={`/song/${songId}?mine=true&vis=${postitTab}`}
                    style={styles.itemLink}
                    title="Şarkıya git (sadece benim notlarım)"
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {s.imageUrl && <img src={s.imageUrl} alt="" style={styles.cover} />}
                      <div>
                        <div style={styles.songTitle}>{s.title}</div>
                        <div style={styles.songMeta}>{s.artist}</div>
                      </div>
                    </div>
                    <div style={styles.chev}>›</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Son dinlenen */}
        <div style={{ ...styles.card, marginTop: 18 }}>
          <div style={styles.sectionTitle}>Recently Lİstened Songs</div>

          {loading && <div style={styles.muted}>Loading...</div>}
          {error && <div style={styles.error}>{error}</div>}

          {!loading && !error && history.length === 0 && (
            <div style={styles.muted}>There is no recent music history for now.</div>
          )}

          <ul style={styles.list}>
            {history.map((h) => {
              const songId = h.songId ?? h.id ?? h.song?.id ?? h.song?.songId;
              const title = h.title ?? h.songTitle ?? h.song?.title ?? "Song";
              const artist = h.artist ?? h.songArtist ?? h.song?.artist ?? "";
              const coverUrl =
                h.imageUrl ?? h.coverUrl ?? h.songCoverUrl ?? h.song?.coverUrl;

              if (!songId) return null;

              return (
                <li key={`${songId}-${title}-${artist}`} style={styles.item}>
                  <Link
                    to={`/song/${songId}?mine=true`}
                    style={styles.itemLink}
                    title="Şarkıya git (sadece benim notlarım)"
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {coverUrl && <img src={coverUrl} alt="" style={styles.cover} />}
                      <div>
                        <div style={styles.songTitle}>{title}</div>
                        <div style={styles.songMeta}>{artist}</div>
                      </div>
                    </div>
                    <div style={styles.chev}>›</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ marginTop: 28 }}>
  <button
    onClick={logout}
    style={{
      width: "100%",
      padding: "12px 16px",
      borderRadius: 16,
      border: "1px solid rgba(239,68,68,0.55)",
      background: "rgba(239,68,68,0.85)", // 🔴 kırmızı kutu
      color: "#ffffff",                  // ⚪ beyaz yazı
      fontWeight: 900,
      fontSize: 14,
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 16px rgba(239,68,68,0.55)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    Log out
  </button>
</div>


        <BottomNav />
      </div>
    </div>
  );
}
