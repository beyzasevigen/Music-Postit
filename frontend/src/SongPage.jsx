import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAuthHeader } from "./auth";
import BottomNav from "./BottomNav";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function SongPage() {
  const { id } = useParams();

  const [song, setSong] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [noteText, setNoteText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState("");

  const [isPublic, setIsPublic] = useState(true);
  const sentPlayHistoryRef = useRef(false);

  const navigate = useNavigate();
  const auth = getAuthHeader();

  const params = new URLSearchParams(window.location.search);
  const onlyMine = params.get("mine") === "true";
  const vis = params.get("vis"); // "public" | "private" | null

  const myUsername = localStorage.getItem("auth_username") || "";
  const myUserIdRaw = localStorage.getItem("auth_userId");
  const myUserId = myUserIdRaw ? Number(myUserIdRaw) : null;

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

    if (vis === "public") arr = arr.filter((n) => n.isPublic === true);
    else if (vis === "private") arr = arr.filter((n) => n.isPublic === false);

    return arr;
  }, [notes, onlyMine, vis, myUserId, myUsername]);

  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  useEffect(() => {
    if (!auth) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const songRes = await fetch(`${API_BASE}/api/songs/${id}`, {
          headers: { Authorization: auth },
        });
        if (!songRes.ok) throw new Error("Şarkı bulunamadı");

        const songData = await songRes.json();
        setSong(songData);

        if (!sentPlayHistoryRef.current) {
          sentPlayHistoryRef.current = true;
          try {
            await fetch(`${API_BASE}/api/play-history`, {
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

        const notesRes = await fetch(
          `${API_BASE}/api/songs/${id}/notes`,
          { headers: { Authorization: auth } }
        );
        if (!notesRes.ok) throw new Error("Notlar alınamadı");

        const notesData = await notesRes.json();
        const normalized = (Array.isArray(notesData) ? notesData : []).map((n) => ({
          ...n,
          liked: Boolean(n.liked),
          likesCount: typeof n.likesCount === "number" ? n.likesCount : 0,
        }));
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

  const createNote = async () => {
    if (!timestamp || !noteText.trim()) return;
    if (!auth) return navigate("/login");

    try {
      const res = await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          songId: Number(id),
          timestampSec: Number(timestamp),
          text: noteText,
          isPublic: isPublic,
        }),
      });

      if (!res.ok) throw new Error("post-it could not saved");

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
      setIsPublic(true);
    } catch (err) {
      console.error(err);
      alert("Error while adding post-it");
    }
  };

  const toggleLike = async (noteId) => {
    if (!auth) return navigate("/login");

    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}/like`, {
        method: "POST",
        headers: { Authorization: auth },
      });

      if (!res.ok) throw new Error("Like işlemi başarısız");

      const data = await res.json();

      setNotes((prev) =>
        prev.map((n) =>
          Number(n.id) === Number(data.noteId)
            ? {
                ...n,
                liked: Boolean(data.liked),
                likesCount: typeof data.likesCount === "number" ? data.likesCount : 0,
              }
            : n
        )
      );
    } catch (err) {
      console.error(err);
      alert("Like işlemi sırasında hata oluştu.");
    }
  };

  const UI = {
  cardBg: "rgba(184,156,255,0.08)",      // mor cam
  cardBorder: "rgba(184,156,255,0.18)",
  inputBg: "rgba(15,23,42,0.55)",
  inputBorder: "rgba(184,156,255,0.22)",
  accent: "#b89cff",                      // Private moru
  accentText: "#120a1d",
};


  // Loading/Error ekranlarını da yeni layouta uydurma
  if (loading) {
    return (
      <div className="page">
        <div className="content" style={{ paddingBottom: 110 }}>
          Loading...
          <BottomNav />
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="page">
        <div className="content" style={{ paddingBottom: 110 }}>
          <p>{error || "Bir hata oluştu."}</p>
          <Link to="/" style={{ color: "#b89cff" }}>
            ← Go Back to the Search
          </Link>
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="content" style={{ paddingBottom: 110 }}>
        <Link to="/" style={{ color: "#b89cff", fontSize: 14 }}>
          ← Go Back to the Search
        </Link>

        {/* HERO */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 24,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "left",
            flexWrap: "wrap",
          }}
        >
          {song.coverUrl && (
            <img
              src={song.coverUrl}
              alt=""
              style={{
                width: 140,
                height: 140,
                borderRadius: 18,
                objectFit: "cover",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            />
          )}

          <div style={{ minWidth: 260 }}>
            <h1 style={{ fontSize: 34, margin: 0, lineHeight: 1.15 }}>
              {song.title}
            </h1>
            <div style={{ color: "#c7c2d6", marginTop: 6 }}>{song.artist}</div>
            <div style={{ color: "#9ca3af", fontSize: 14, marginTop: 2 }}>
              {song.album}
            </div>

            {song.durationSec && (
              <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 10 }}>
                Time: {Math.floor(song.durationSec / 60)}:
                {(song.durationSec % 60).toString().padStart(2, "0")}
              </div>
            )}
          </div>
        </div>

        {/* Yeni not formu (Card) */}
        <div
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 18,
            background: UI.cardBg,
            border: `1px solid ${UI.cardBorder}`,

            backdropFilter: "blur(12px)",
          }}
        >
          <h2 style={{ fontSize: 18, margin: 0, marginBottom: 14 }}>Add a New Post-It</h2>

          <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "stretch" }}>
            <div style={{ width: 140 }}>
              <label style={{ fontSize: 12, color: "#c7c2d6" }}>
                Time (as second)
              </label>
              <input
                type="number"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                min="0"
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  height: 68,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(15,23,42,0.65)",
                  color: "#eae7f2",
                  width: "100%",
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={{ fontSize: 12, color: "#c7c2d6" }}>Post-It</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                style={{
                  marginTop: 6,
                  height: 69,
                  resize: "none",
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(15,23,42,0.65)",
                  color: "#eae7f2",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          {/* Public/Private */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
            <button
              type="button"
              onClick={() => setIsPublic(true)}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: isPublic ? "#b89cff" : "rgba(15,23,42,0.65)",
                color: isPublic ? "#120a1d" : "#c7c2d6",
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
                padding: "7px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: !isPublic ? "#b89cff" : "rgba(15,23,42,0.65)",
                color: !isPublic ? "#120a1d" : "#c7c2d6",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              Private
            </button>

            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              {isPublic ? "Open to everyone" : "Just me"}
            </span>
          </div>

          <button
            onClick={createNote}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              background: UI.accent,
              color: UI.accentText,
              fontWeight: 800,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Leave the Post-It
          </button>
        </div>

        {/* Not listesi */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>
            Post-Its in this song {onlyMine ? "(Just mine)" : ""}
          </h2>

          {filteredNotes.length === 0 && (
            <div style={{ color: "#9ca3af", fontSize: 14 }}>
              {onlyMine ? "There is no personal post-it in that song" : "Leave the first post-it for this song."}
            </div>
          )}

          <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
            {filteredNotes.map((note) => (
              <li
                key={note.id}
                style={{
                  padding: 14,
                  marginBottom: 10,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "#c7c2d6", marginBottom: 6 }}>
                      {note.timestampSec}s — {note.username}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.45 }}>{note.text}</div>
                  </div>

                  <button
                    onClick={() => toggleLike(note.id)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: note.liked ? "rgba(184,156,255,0.85)" : UI.inputBg,
                      color: note.liked ? UI.accentText : "#eae7f2",
                      border: `1px solid ${UI.inputBorder}`,
                      color: "#eae7f2",
                      cursor: "pointer",
                      minWidth: 74,
                      fontSize: 13,
                      fontWeight: 700,
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

        <BottomNav />
      </div>
    </div>
  );
}
