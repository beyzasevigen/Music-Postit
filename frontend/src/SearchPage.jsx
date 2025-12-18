import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "./auth";
import BottomNav from "./BottomNav";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const navigate = useNavigate();
  const auth = getAuthHeader();

  // 🔐 auth yoksa login
  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  useEffect(() => {
    const u = localStorage.getItem("auth_username") || "";
    setUsername(u);
  }, []);

  useEffect(() => {
  setUsername(localStorage.getItem("auth_username") || "");
  setAvatarUrl(
    localStorage.getItem("auth_avatar") ||
      "https://placehold.co/32x32"
  );
}, []);


  // Sonuç var mı? (loading/error da varsa hero yukarı çıksın)
  const hasResults = useMemo(
    () => results.length > 0 || loading || !!error,
    [results.length, loading, error]
  );

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

      if (!response.ok) throw new Error("Şarkı kaydedilemedi: " + response.status);

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
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/external/search?query=${encodeURIComponent(query)}`,
        { method: "GET", headers: { Authorization: auth } }
      );

      if (!response.ok) throw new Error("Arama başarısız: " + response.status);

      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Arama sırasında bir hata oluştu.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="page" style={{ position: "relative" }}>
      <div className="content" style={{ paddingBottom: 110 }}>
        {/* HERO: sonuç yokken ortada, sonuç gelince yukarı */}
        <div
          className="searchHero"
          style={
            hasResults
              ? { justifyContent: "flex-start", paddingTop: 48, minHeight: "auto" }
              : {}
          }
        >
          {username && (
  <div
    style={{
      position: "absolute",
      top: 20,
      right: 24,
      display: "flex",
      alignItems: "center",
      gap: 10,
      zIndex: 10,
    }}
  >
    {/* ❓ Yardım butonu (Thymeleaf) */}
    <a
      href="http://localhost:8080/help"
      target="_blank"
      rel="noreferrer"
      title="Yardım"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "rgba(184,156,255,0.12)",
        border: "1px solid rgba(184,156,255,0.35)",
        color: "#b89cff",
        textDecoration: "none",
        fontWeight: 900,
        fontSize: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 10px rgba(184,156,255,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      ?
    </a>

    {/* 👤 Profil alanı */}
    <div
      onClick={() => navigate("/profile")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        cursor: "pointer",

        background: "rgba(184,156,255,0.12)",
        border: "1px solid rgba(184,156,255,0.35)",
        color: "#b89cff",
        fontSize: 13,
        fontWeight: 800,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 12px rgba(184,156,255,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <img
        src={avatarUrl}
        alt="avatar"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <span>{username}</span>
    </div>
  </div>
)}




          <h1 style={{ fontSize: hasResults ? 28 : 40, margin: 0 }}>
            Music PostIt · Search
          </h1>

          <div className="searchRow">
            <input
              className="searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a song or artist..."
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #4b5563",
                background: "#0f172a",
                color: "#e5e7eb",
              }}
            />

            <button
              className="searchBtn"
              onClick={search}
              style={{
                border: "none",
                background: "#b89cff",
                color: "#000",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Search
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
        </div>

        {/* ✅ SONUÇLAR HERO'NUN DIŞINDA */}
        {results.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
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
                    <div style={{ fontWeight: 700 }}>{song.title}</div>
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
                    borderRadius: 10,
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
        )}

        <BottomNav />
      </div>
    </div>
  );
}
