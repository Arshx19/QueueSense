import React, { useState, useEffect } from "react";
import axios from "axios";

function QueuePage() {
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

  const addPerson = async () => {
    await axios.post(`http://localhost:5000/api/queue/${queueId}/add`);
    fetchQueue();
  };

  const serveNext = async () => {
    await axios.post(`http://localhost:5000/api/queue/${queueId}/serve`);
    fetchQueue();
  };

  const resetQueue = async () => {
    await axios.post(`http://localhost:5000/api/queue/${queueId}/reset`);
    fetchQueue();
  };

  const togglePause = async () => {
    await axios.post(`http://localhost:5000/api/queue/${queueId}/pause`);
    fetchQueue();
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!queue)
    return (
      <div style={loadingStyle}>
        <div style={loadingCard}>
          <div style={spinnerStyle} />
          <p style={loadingText}>Loading dashboard...</p>
        </div>
      </div>
    );

  const waitMins =
    queue.serviceRate > 0
      ? Math.ceil(queue.currentLength / queue.serviceRate)
      : 0;

  const fillPercent = Math.min(
    Math.round((queue.currentLength / queue.maxCapacity) * 100),
    100
  );

  return (
    <div style={container}>
      {/* Navbar */}
      <div style={navbar}>
      <span style={{color: "#16a34a", fontSize: "12px", fontWeight: "600"}}>
        ● LIVE
      </span>
        <span style={brand}>QueueSense</span>
        <span style={navBadge}>Dashboard</span>
      </div>


      <div style={card}>
        <p style={cardLabel}>Queue Management</p>
        <h1 style={cardTitle}>Queue Dashboard</h1>
        <div style={divider} />

        {/* Stats Grid */}
        <div style={statsGrid}>
          <div style={statTile}>
            <span style={statTileLabel}>In Queue</span>
            <span style={statTileValue}>{queue.currentLength}</span>
          </div>
          <div style={statTile}>
            <span style={statTileLabel}>Max Capacity</span>
            <span style={statTileValue}>{queue.maxCapacity}</span>
          </div>
          <div style={statTile}>
            <span style={statTileLabel}>Wait Time</span>
            <span style={statTileValue}>{waitMins}m</span>
          </div>
          <div
            style={{
              ...statTile,
              background: queue.isPaused ? "#fff1f2" : "#f0fdf4",
              borderColor: queue.isPaused ? "#fca5a5" : "#86efac",
            }}
          >
            <span style={statTileLabel}>Status</span>
            <span
              style={{
                ...statTileValue,
                color: queue.isPaused ? "#ef4444" : "#16a34a",
              }}
            >
              {queue.isPaused ? "Paused" : "Active"}
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div style={capacitySection}>
          <div style={capacityHeader}>
            <span style={capacityLabel}>Capacity</span>
            <span style={capacityPercent}>{fillPercent}%</span>
          </div>
          <div style={progressTrack}>
            <div
              style={{
                ...progressFill,
                width: `${fillPercent}%`,
                background:
                  fillPercent >= 80
                    ? "#ef4444"
                    : fillPercent >= 50
                    ? "#f59e0b"
                    : "#4f46e5",
              }}
            />
          </div>
        </div>

        {/* Alert */}
        {queue.currentLength > queue.maxCapacity * 0.8 && (
          <div style={alertBox}>
            <span>⚠</span> Queue is Overcrowded
          </div>
        )}

        {/* Buttons */}
        <div style={btnGrid}>
          <button
            style={{
              ...btnBase,
              ...btnPrimary,
              opacity: queue.isPaused ? 0.5 : 1,
              cursor: queue.isPaused ? "not-allowed" : "pointer",
            }}
            onClick={addPerson}
            disabled={queue.isPaused}
          >
            ➕ Add Person
          </button>

          <button style={{ ...btnBase, ...btnSecondary }} onClick={serveNext}>
            ➖ Serve Next
          </button>

          <button style={{ ...btnBase, ...btnWarning }} onClick={resetQueue}>
            🔁 Reset Queue
          </button>

          <button
            style={{
              ...btnBase,
              ...(queue.isPaused ? btnResume : btnPause),
            }}
            onClick={togglePause}
          >
            {queue.isPaused ? "▶ Resume Queue" : "⏸ Pause Queue"}
          </button>
        </div>
      </div>

      <p style={footer}>Auto-refreshes every 5 seconds</p>
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
  padding: "40px 44px",
  borderRadius: "20px",
  boxShadow: "0 8px 40px rgba(99, 102, 241, 0.12)",
  width: "480px",
  marginTop: "56px",
  boxSizing: "border-box",
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
  fontSize: "26px",
  fontWeight: "700",
  color: "#1e1b4b",
  margin: "0",
};

const divider = {
  height: "2px",
  background: "linear-gradient(90deg, #4f46e5, #a78bfa)",
  borderRadius: "999px",
  width: "48px",
  margin: "18px 0 24px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginBottom: "24px",
};

const statTile = {
  background: "#f5f3ff",
  border: "1px solid #ddd6fe",
  borderRadius: "12px",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const statTileLabel = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const statTileValue = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#4f46e5",
};

const capacitySection = {
  marginBottom: "20px",
};

const capacityHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const capacityLabel = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#6b7280",
};

const capacityPercent = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#4f46e5",
};

const progressTrack = {
  height: "8px",
  background: "#e0e7ff",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  borderRadius: "999px",
  transition: "width 0.5s ease",
};

const alertBox = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#fff1f2",
  border: "1px solid #fca5a5",
  color: "#be123c",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "14px",
  marginBottom: "20px",
};

const btnGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const btnBase = {
  padding: "13px 10px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  fontFamily: "'Segoe UI', sans-serif",
  transition: "opacity 0.2s",
};

const btnPrimary = {
  background: "#4f46e5",
  color: "white",
};

const btnSecondary = {
  background: "#0ea5e9",
  color: "white",
};

const btnWarning = {
  background: "#f59e0b",
  color: "white",
};

const btnPause = {
  background: "#fee2e2",
  color: "#ef4444",
};

const btnResume = {
  background: "#dcfce7",
  color: "#16a34a",
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
  width: "36px",
  height: "36px",
  border: "3px solid #e0e7ff",
  borderTop: "3px solid #4f46e5",
  borderRadius: "50%",
  animation: "spin 0.9s linear infinite",
  margin: "0 auto 14px",
};

const loadingText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: 0,
};

// Inject spinner keyframe once
if (!document.getElementById("qs-spinner-style")) {
  const s = document.createElement("style");
  s.id = "qs-spinner-style";
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

export default QueuePage;