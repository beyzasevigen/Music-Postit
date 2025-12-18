import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    return pathname.startsWith(path) && path !== "/";
  };

  const itemStyle = (path) => ({
    ...styles.item,
    ...(isActive(path) ? styles.active : {}),
  });

  return (
    <div style={styles.wrap}>
      <Link to="/" style={itemStyle("/")}>
        <div style={styles.icon}>🔎</div>
        <div style={styles.text}>Search</div>
        {isActive("/") && <div style={styles.dot} />}
      </Link>

      <Link to="/notifications" style={itemStyle("/notifications")}>
        <div style={styles.icon}>💜</div>
        <div style={styles.text}>Notification</div>
        {isActive("/notifications") && <div style={styles.dot} />}
      </Link>

      <Link to="/profile" style={itemStyle("/profile")}>
        <div style={styles.icon}>👤</div>
        <div style={styles.text}>Profile</div>
        {isActive("/profile") && <div style={styles.dot} />}
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
    height: 68,

    background: "rgba(59,47,85,0.85)",   // koyu mat mor
    border: "1px solid rgba(120,105,160,0.35)",
    borderRadius: 20,

    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
    zIndex: 50,
  },

  item: {
    textDecoration: "none",
    color: "rgba(220,215,235,0.85)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,

    width: 96,
    padding: "10px 8px",
    borderRadius: 16,

    position: "relative",
    transition: "all 0.18s ease",
  },

  active: {
    background: "rgba(120,105,160,0.85)", // mat açık mor
    color: "#1b102d",
    border: "1px solid rgba(160,145,200,0.45)",
    transform: "translateY(-2px)",
  },

  dot: {
    position: "absolute",
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "#1b102d",
    opacity: 0.9,
  },

  icon: { fontSize: 20, lineHeight: 1 },
  text: { fontSize: 12, fontWeight: 900, letterSpacing: 0.2 },
};

