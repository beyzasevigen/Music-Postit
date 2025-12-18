import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAuthHeader } from "./auth";

export default function SongPage() {
  const { id } = useParams(); // URL'deki :id (songId)

  const [song, setSong] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [noteText, setNoteText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState("");

  const [isPublic, setIsPublic] = useState(true); // ✅ default public
  const sentPlayHistoryRef = useRef(false);

  const navigate = useNavigate();
  const auth = getAuthHeader();

  const params = new URLSearchParams(window.location.search);
  const onlyMine = params.get("mine") === "true";
  const vis = params.get("vis"); // "public" | "private" | null

  // ✅ kendi kullanıcı bilgisini localStorage'dan al
  const myUsername = localStorage.getItem("auth_username") || "";
  const myUserIdRaw = localStorage.getItem("auth_userId");
  const myUserId = myUserIdRaw ? Number(myUserIdRaw) : null;

  // ✅ mine=true ise sadece benim notlarım + vis filtresi
  const filteredNotes = useMemo(() => {
    let arr = Array.isArray(notes) ? notes : [];

    if (onlyMine) {
      arr = arr.filter((n) => {
        if (myUserId != null && n.userId != null) {
          return Number(n.userId) === Number(myUserId);
        }
        if (myUsername && n.username) {
          return n.username === myUsername;
        }
        return false;
      });
    }

    if (vis === "public") {
      arr = arr.filter((n) => n.isPublic === true);
    } else if (vis === "private") {
      arr = arr.filter((n) => n.isPublic === false);
    }

    return arr;
  }, [notes, onlyMine, vis, myUserId, myUsername]);

  // 🔐 login yoksa yönlendir
  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  // 🎵 Şarkı + notları yükle
  useEffect(() => {
    if (!auth) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) Şarkı bilgisi
        const songRes = await fetch(`http://localhost:8080/api/songs/${id}`, {
          headers: { Authorization: auth },
        });

        if (!songRes.ok) throw new Error("Şarkı bulunamadı");

        const songData = await songRes.json();
        setSong(songData);

        // ✅ StrictMode double-call engeli: play-history sadece 1 kere
        if (!sentPlayHistoryRef.current) {
          sentPlayHistoryRef.current = true;
          try {
            await fetch("http://localhost:8080/api/play-history", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: auth,
              },
              body: JSON.stringify({
                songId: Number(id),
                lastPositionSec: null,
              }),
            });
          } catch (e) {
            console.error("play-history yazılamadı", e);
          }
        }

        // 2) Notlar
        const notesRes = await fetch(
          `http://localhost:8080/api/songs/${id}/notes`,
          { headers: { Authorization: auth } }
        );

        if (!notesRes.ok) throw new Error("Notlar alınamadı");

        const notesData = await notesRes.json();

        const normalized = (Array.isArray(notesData) ? notesData : []).map(
          (n) => ({
            ...n,
            liked: Boolean(n.liked),
            likesCount: typeof n.likesCount === "number" ? n.likesCount : 0,
          })
        );

        setNotes(normalized);
      } catch (err) {
        console.error(err);
        setError("Şarkı veya notlar yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, auth]);

  // ➕ Yeni not ekleme ✅ (BURASI createNote)
  const createNote = async () => {
    if (!timestamp || !noteText.trim()) return;
    if (!auth) return navigate("/login");

    try {
      const res = await fetch("http://localhost:8080/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          songId: Number(id),
          timestampSec: Number(timestamp),
          text: noteText,
          isPublic: isPublic, // ✅ EKLENDİ
        }),
      });

      if (!res.ok) throw new Error("Not eklenemedi");

      const created = await res.json();

      const normalized = {
        ...created,
        liked: Boolean(created.liked),
        likesCount: typeof created.likesCount === "number" ? created.likesCount : 0,
      };

      setNotes((prev) =>
        [...prev, normalized].sort((a, b) => a.timestampSec - b.timestampSec)
      );

      setNoteText("");
      setTimestamp("");
      setIsPublic(true); // reset
    } catch (err) {
      console.error(err);
      alert("Not eklerken bir hata oluştu.");
    }
  };

  // ❤️ Like / Unlike
  const toggleLike = async (noteId) => {
    if (!auth) return navigate("/login");

    try {
      const res = await fetch(
        `http://localhost:8080/api/notes/${noteId}/like`,
        {
          method: "POST",
          headers: { Authorization: auth },
        }
      );

      if (!res.ok) throw new Error("Like işlemi başarısız");

      const data = await res.json();

      setNotes((prev) =>
        prev.map((n) =>
          Number(n.id) === Number(data.noteId)
            ? {
                ...n,
                liked: Boolean(data.liked),
                likesCount:
                  typeof data.likesCount === "number" ? data.likesCount : 0,
              }
            : n
        )
      );
    } catch (err) {
      console.error(err);
      alert("Like işlemi sırasında hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "#e5e7eb",
          padding: "32px",
        }}
      >
        Yükleniyor...
      </div>
    );
  }

  if (error || !song) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "#e5e7eb",
          padding: "32px",
        }}
      >
        <p>{error || "Bir hata oluştu."}</p>
        <Link to="/" style={{ color: "#38bdf8" }}>
          ← Aramaya dön
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        padding: "32px",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Link to="/" style={{ color: "#38bdf8", fontSize: 14 }}>
        ← Spotify aramaya dön
      </Link>

      {/* Şarkı header */}
      <div style={{ marginTop: 16, display: "flex", gap: 24, alignItems: "center" }}>
        {song.coverUrl && (
          <img
            src={song.coverUrl}
            alt=""
            style={{ width: 120, height: 120, borderRadius: 16, objectFit: "cover" }}
          />
        )}

        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>{song.title}</h1>
          <div style={{ color: "#9ca3af", marginBottom: 4 }}>{song.artist}</div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>{song.album}</div>
          {song.durationSec && (
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>
              Süre: {Math.floor(song.durationSec / 60)}:
              {(song.durationSec % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      {/* Yeni not formu */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          borderRadius: 16,
          background: "#030712",
          border: "1px solid #1f2937",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Yeni not ekle</h2>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#9ca3af" }}>Zaman (saniye)</label>
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              min="0"
              style={{
                marginTop: 4,
                padding: "6px 8px",
                borderRadius: 8,
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
                width: 120,
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: "#9ca3af" }}>Not</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "6px 8px",
                borderRadius: 8,
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* ✅ Public / Private seçici (DOĞRU YERİ BURASI) */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #1f2937",
              background: isPublic ? "#38bdf8" : "#0f172a",
              color: isPublic ? "#020617" : "#9ca3af",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            Public
          </button>

          <button
            type="button"
            onClick={() => setIsPublic(false)}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #1f2937",
              background: !isPublic ? "#38bdf8" : "#0f172a",
              color: !isPublic ? "#020617" : "#9ca3af",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            Private
          </button>

          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {isPublic ? "Herkese açık" : "Sadece ben"}
          </span>
        </div>

        <button
          onClick={createNote}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            background: "#38bdf8",
            color: "#020617",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Notu ekle
        </button>
      </div>

      {/* Not listesi */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>
          Şarkıdaki notlar {onlyMine ? "(Sadece benim)" : ""}
        </h2>

        {filteredNotes.length === 0 && (
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            {onlyMine ? "Bu şarkıda sana ait not yok." : "Bu şarkı için henüz not yok."}
          </div>
        )}

        <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
          {filteredNotes.map((note) => (
            <li
              key={note.id}
              style={{
                padding: 12,
                marginBottom: 8,
                borderRadius: 12,
                background: "#030712",
                border: "1px solid #1f2937",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                    {note.timestampSec}s — {note.username}
                  </div>
                  <div style={{ fontSize: 14 }}>{note.text}</div>
                </div>

                <button
                  onClick={() => toggleLike(note.id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    background: note.liked ? "#ef4444" : "#0f172a",
                    color: "#e5e7eb",
                    cursor: "pointer",
                    minWidth: 72,
                    fontSize: 13,
                  }}
                  title="Like"
                >
                  {note.liked ? "❤️" : "🤍"} {note.likesCount}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
