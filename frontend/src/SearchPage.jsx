import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "./auth";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const auth = getAuthHeader();

  // 🎵 Spotify'dan gelen şarkıyı backend'e kaydet
  const importSong = async (song) => {
    try {
      const response = await fetch("http://localhost:8080/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          externalId: song.externalId,
          title: song.title,
          artist: song.artist,
          album: song.album,
          coverUrl: song.coverUrl,
          durationSec: song.durationSec,
        }),
      });

      if (!response.ok) {
        throw new Error("Şarkı kaydedilemedi: " + response.status);
      }

      const saved = await response.json();
      setSuccess(`"${saved.title}" sisteme eklendi`);
      navigate(`/song/${saved.id}`);
    } catch (err) {
      console.error(err);
      setSuccess("");
      alert("Şarkıyı kaydederken hata oluştu.");
    }
  };

  // 🔍 Spotify araması
  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/external/search?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: auth,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Arama başarısız: " + response.status);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Arama sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

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
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>
        Music PostIt · Spotify Search
      </h1>

      <div style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Şarkı veya sanatçı ara..."
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #4b5563",
            minWidth: 260,
            marginRight: 8,
            background: "#0f172a",
            color: "#e5e7eb",
          }}
        />

        <button
          onClick={search}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "#22c55e",
            color: "#000",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Ara
        </button>
      </div>

      {loading && <div>Aranıyor...</div>}
      {error && <div style={{ color: "#f97316" }}>{error}</div>}
      {success && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: "#022c22",
            color: "#bbf7d0",
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {results.map((song) => (
          <li
            key={song.externalId}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #1f2937",
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {song.coverUrl && (
                <img
                  src={song.coverUrl}
                  alt=""
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              )}

              <div>
                <div style={{ fontWeight: 600 }}>{song.title}</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>
                  {song.artist} · {song.album}
                </div>
                {song.durationSec && (
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {Math.floor(song.durationSec / 60)}:
                    {(song.durationSec % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => importSong(song)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #4b5563",
                background: "#0f172a",
                color: "#e5e7eb",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Bu şarkıyı ekle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
