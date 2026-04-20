import React, { useEffect, useState } from "react";
import axios from "axios";

function PublicDisplay() {
  const queueId = "69d1272a28c3b992848f27de";
  const [queue, setQueue] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/queue/${queueId}`);
      setQueue(res.data.queue);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!queue)
    return (
      <div style={loadingStyle}>
        <div style={loadingCard}>
          <div style={spinnerStyle} />
          <p style={loadingText}>Loading Display...</p>
        </div>
      </div>
    );

  const waitMins =
    queue.serviceRate > 0
      ? Math.ceil(queue.currentLength / queue.serviceRate)
      : 0;

  return (
    <div style={container}>
      {/* Navbar */}
      <div style={navbar}>
        <span style={{color: "#16a34a", fontSize: "12px", fontWeight: "600"}}>
        ● LIVE</span>
        <span style={brand}>QueueSense</span>
        <span style={navBadge}>Live Display</span>
      </div>

      {/* Card */}
      <div style={card}>
        <p style={cardLabel}>Queue Status</p>
        <h1 style={cardTitle}>Live Monitor</h1>
        <div style={divider} />

        {/* Big Number */}
        <div style={numberBox}>{queue.currentLength}</div>
        <p style={subText}>People Currently in Queue</p>

        {/* Stats Row */}
        <div style={statsRow}>
          <div style={statChip}>
            <span style={statChipLabel}>Estimated Wait</span>
            <span style={statChipValue}>{waitMins} min{waitMins !== 1 ? "s" : ""}</span>
          </div>
          <div
            style={{
              ...statChip,
              background: queue.isPaused ? "#fff1f2" : "#f0fdf4",
              borderColor: queue.isPaused ? "#fca5a5" : "#86efac",
            }}
          >
            <span style={statChipLabel}>Status</span>
            <span
              style={{
                ...statChipValue,
                color: queue.isPaused ? "#ef4444" : "#16a34a",
              }}
            >
              {queue.isPaused ? "Paused" : "Active"}
            </span>
          </div>
        </div>

        {/* Alert */}
        {queue.currentLength > queue.maxCapacity * 0.8 && (
          <div style={alertBox}>
            <span style={alertIcon}>⚠</span>
            Queue is Overcrowded
          </div>
        )}
      </div>
      <p style={footer}>Auto-refreshes every 3 seconds</p>
    </div>
  );
}

/* ── Styles ── */

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 40%, #fce7f3 100%)",
  fontFamily: "'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const navbar = {
  width: "100%",
  padding: "16px 40px",
  background: "white",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
};

const brand = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#4f46e5",
};

const navBadge = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6d28d9",
  background: "#ede9fe",
  padding: "4px 12px",
  borderRadius: "999px",
  letterSpacing: "0.04em",
};

const card = {
  background: "white",
  padding: "44px 48px",
  borderRadius: "20px",
  boxShadow: "0 8px 40px rgba(99, 102, 241, 0.12)",
  textAlign: "center",
  width: "460px",
  marginTop: "64px",
};

const cardLabel = {
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.1em",
  color: "#a78bfa",
  textTransform: "uppercase",
  margin: "0 0 6px 0",
};

const cardTitle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#1e1b4b",
  margin: "0",
};

const divider = {
  height: "2px",
  background: "linear-gradient(90deg, #4f46e5, #a78bfa)",
  borderRadius: "999px",
  margin: "20px 0",
  width: "48px",
  marginLeft: "auto",
  marginRight: "auto",
};

const numberBox = {
  fontSize: "96px",
  fontWeight: "800",
  color: "#4f46e5",
  lineHeight: "1",
  margin: "8px 0 4px",
  letterSpacing: "-4px",
  transform: "scale(1.05)",
  // transition: "transform 0.2s ease",
  animation: "pulse 0.6s ease"
};

const subText = {
  fontSize: "15px",
  color: "#6b7280",
  margin: "0 0 28px 0",
};

const statsRow = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  marginBottom: "24px",
};

const statChip = {
  flex: 1,
  background: "#f5f3ff",
  border: "1px solid #ddd6fe",
  borderRadius: "12px",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const statChipLabel = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const statChipValue = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#4f46e5",
};

const alertBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "#fff1f2",
  border: "1px solid #fca5a5",
  color: "#be123c",
  padding: "12px 16px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "14px",
};

const alertIcon = {
  fontSize: "16px",
};

const footer = {
  marginTop: "20px",
  fontSize: "12px",
  color: "#9ca3af",
};

const loadingStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 40%, #fce7f3 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Segoe UI', sans-serif",
};

const loadingCard = {
  background: "white",
  padding: "48px 56px",
  borderRadius: "20px",
  boxShadow: "0 8px 40px rgba(99, 102, 241, 0.12)",
  textAlign: "center",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #e0e7ff",
  borderTop: "3px solid #4f46e5",
  borderRadius: "50%",
  animation: "spin 0.9s linear infinite",
  margin: "0 auto 16px",
};

const loadingText = {
  color: "#6b7280",
  fontSize: "15px",
  margin: 0,
};

// Inject spinner keyframe
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default PublicDisplay;