import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    return pathname.startsWith(path) && path !== "/";
  };

  return (
    <div style={styles.wrap}>
      <Link to="/" style={{ ...styles.item, ...(isActive("/") ? styles.active : {}) }}>
        <div style={styles.icon}>🔎</div>
        <div style={styles.text}>Ara</div>
      </Link>

      <Link
        to="/notifications"
        style={{ ...styles.item, ...(isActive("/notifications") ? styles.active : {}) }}
      >
        <div style={styles.icon}>❤️</div>
        <div style={styles.text}>Bildirim</div>
      </Link>

      <Link
        to="/profile"
        style={{ ...styles.item, ...(isActive("/profile") ? styles.active : {}) }}
      >
        <div style={styles.icon}>👤</div>
        <div style={styles.text}>Profil</div>
      </Link>
    </div>
  );
}

const styles = {
  wrap: {
    position: "fixed",
    left: 16,
    right: 16,
    bottom: 16,
    height: 64,
    background: "#030712",
    border: "1px solid #1f2937",
    borderRadius: 18,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 50,
  },
  item: {
    textDecoration: "none",
    color: "#9ca3af",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    width: 90,
    padding: "8px 6px",
    borderRadius: 14,
  },
  active: {
    color: "#e5e7eb",
    background: "#0f172a",
    border: "1px solid #1f2937",
  },
  icon: { fontSize: 20, lineHeight: 1 },
  text: { fontSize: 12, fontWeight: 700 },
};
