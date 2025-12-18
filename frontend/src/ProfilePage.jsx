import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthHeader } from "./auth";
import BottomNav from "./BottomNav";

const API_BASE = "http://localhost:8080";

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = getAuthHeader();

  const [me, setMe] = useState({ username: "", email: "" });

  // ✅ Dinleme geçmişi
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Postitlerim
  const [postitTab, setPostitTab] = useState("public"); // "public" | "private"
  const [postitSongs, setPostitSongs] = useState([]);
  const [postitLoading, setPostitLoading] = useState(false);
  const [postitError, setPostitError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");


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

      // 1) Kullanıcı bilgisi localStorage
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

            // SongPage filtreleme için iyi olur:
            localStorage.setItem("auth_userId", String(meData.id || ""));
            localStorage.setItem("auth_username", meData.username || "");
            localStorage.setItem("auth_email", meData.email || "");

      } catch {}

      // 2) Play history çek
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

    // UI'ı anında güncelle
    setMe((prev) => ({
      ...prev,
      username: editUsername,
      imageUrl: editImageUrl,
    }));

    localStorage.setItem("auth_username", editUsername || "");
    setEditOpen(false);
  } catch (e) {
    alert("Profil güncellenirken hata oluştu");
    console.error(e);
  }
};


  // ✅ Postitlerim (public/private) şarkı listesi çek
  const loadPostits = async (tab) => {
    if (!auth) return;

    setPostitLoading(true);
    setPostitError("");

    try {
      // 1) Benim tüm notlarım
      const res = await fetch(`${API_BASE}/api/notes/mine`, {
        headers: { Authorization: auth },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `notes/mine alınamadı (${res.status})`);
      }

      const notesData = await res.json();
      const allNotes = Array.isArray(notesData) ? notesData : [];

      // 2) Sekmeye göre filtre (public/private)
      const wantPublic = tab === "public";
      const filtered = allNotes.filter((n) => n.isPublic === wantPublic);

      // 3) Unique songId listesi
      const songIds = Array.from(
        new Set(filtered.map((n) => n.songId).filter(Boolean))
      );

      // 4) Şarkı detaylarını çek
      const songs = await Promise.all(
        songIds.map(async (sid) => {
          const sr = await fetch(`${API_BASE}/api/songs/${sid}`, {
            headers: { Authorization: auth },
          });
          if (!sr.ok) return null;

          const s = await sr.json();
          return {
            id: sid, // UI aynı kalsın diye id kullandım
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

  // Tab değişince postitleri yenile
  useEffect(() => {
    if (!auth) return;
    loadPostits(postitTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postitTab, auth]);

  return (
    <div style={styles.page}>
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
        style={{
            marginTop: 12,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #1f2937",
            background: "#0f172a",
            color: "#e5e7eb",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
        }}
        >
        Profili Düzenle
        </button>
        {editOpen && (
  <div style={{ ...styles.card, marginTop: 18 }}>
    <div style={styles.sectionTitle}>Profili Düzenle</div>

    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: "#9ca3af" }}>Kullanıcı adı</label>
      <input
        value={editUsername}
        onChange={(e) => setEditUsername(e.target.value)}
        style={{
          width: "100%",
          marginTop: 4,
          padding: "6px 8px",
          borderRadius: 8,
          border: "1px solid #4b5563",
          background: "#020617",
          color: "#e5e7eb",
        }}
      />
    </div>

    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: "#9ca3af" }}>
        Profil foto URL
      </label>
      <input
        value={editImageUrl}
        onChange={(e) => setEditImageUrl(e.target.value)}
        placeholder="https://..."
        style={{
          width: "100%",
          marginTop: 4,
          padding: "6px 8px",
          borderRadius: 8,
          border: "1px solid #4b5563",
          background: "#020617",
          color: "#e5e7eb",
        }}
      />
    </div>

    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={saveProfile}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "none",
          background: "#38bdf8",
          color: "#020617",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Kaydet
      </button>

      <button
        onClick={() => setEditOpen(false)}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #1f2937",
          background: "#0f172a",
          color: "#9ca3af",
          cursor: "pointer",
        }}
      >
        Vazgeç
      </button>
    </div>
  </div>
)}



      {/* Postitlerim */}
      <div style={{ ...styles.card, marginTop: 18 }}>
        <div style={styles.sectionTitle}>Postitlerim</div>

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

        {postitLoading && <div style={styles.muted}>Yükleniyor...</div>}
        {postitError && <div style={styles.error}>{postitError}</div>}

        {!postitLoading && !postitError && postitSongs.length === 0 && (
          <div style={styles.muted}>Bu sekmede henüz postitin yok.</div>
        )}

        <ul style={styles.list}>
          {postitSongs.map((s, idx) => {
            const songId = s.id; // burada id = songId
            const title = s.title ?? "Song";
            const artist = s.artist ?? "";
            const coverUrl = s.imageUrl ?? "";

            if (!songId) return null;

            return (
              <li key={`${songId}-${idx}`} style={styles.item}>
                <Link
                  to={`/song/${songId}?mine=true&vis=${postitTab}`}
                  style={styles.itemLink}
                  title="Şarkıya git (sadece benim notlarım)"
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {coverUrl && (
                      <img src={coverUrl} alt="" style={styles.cover} />
                    )}
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

      {/* History */}
      <div style={{ ...styles.card, marginTop: 18 }}>
        <div style={styles.sectionTitle}>Son dinlenen şarkılar</div>

        {loading && <div style={styles.muted}>Yükleniyor...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && history.length === 0 && (
          <div style={styles.muted}>Henüz dinleme geçmişin yok.</div>
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
                    {coverUrl && (
                      <img src={coverUrl} alt="" style={styles.cover} />
                    )}
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

      {/* ✅ alt menü */}
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
    paddingBottom: 110,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  card: {
    background: "#030712",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 18,
  },
  profileRow: { display: "flex", gap: 14, alignItems: "center" },
  avatar: { width: 84, height: 84, borderRadius: "50%", objectFit: "cover" },
  name: { fontSize: 22, fontWeight: 800 },
  email: { color: "#9ca3af", marginTop: 4, fontSize: 14 },
  hint: { marginTop: 10, color: "#6b7280", fontSize: 13 },

  sectionTitle: { fontSize: 16, fontWeight: 800, marginBottom: 10 },
  muted: { color: "#6b7280", fontSize: 14 },
  error: { color: "#f97316", fontSize: 14 },

  tabRow: { display: "flex", gap: 10, marginBottom: 10 },
  tabBtn: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #1f2937",
    background: "#0f172a",
    color: "#9ca3af",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },
  tabActive: { background: "#38bdf8", color: "#020617", border: "none" },

  list: { listStyle: "none", padding: 0, margin: 0, marginTop: 8 },
  item: { borderTop: "1px solid #1f2937" },
  itemLink: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
    textDecoration: "none",
    color: "#e5e7eb",
  },
  cover: { width: 44, height: 44, borderRadius: 10, objectFit: "cover" },
  songTitle: { fontWeight: 700 },
  songMeta: { fontSize: 13, color: "#9ca3af" },
  chev: { color: "#475569", fontSize: 22, lineHeight: 1 },
};
