import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function PublicDisplay() {
  const { id } = useParams(); // ✅ use URL param instead of localStorage
  const role = localStorage.getItem("role");

  const [queue, setQueue] = useState(null);
  const navigate = useNavigate();

  const fetchQueue = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/queue/${id}`
      );
      setQueue(res.data);
    } catch (err) {
      console.error("DISPLAY ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);

    return () => clearInterval(interval);
  }, [id]);

  // ⛔ Loading state
  if (!queue) {
    return (
      <div style={loadingStyle}>
        <div style={loadingCard}>
          <div style={spinnerStyle}></div>
          <p style={loadingText}>Loading Display...</p>
        </div>
      </div>
    );
  }

  const waitMins =
    queue.serviceRate > 0
      ? Math.ceil(queue.currentLength / queue.serviceRate)
      : 0;

  return (
    <div style={container}>
      {/* NAVBAR */}
      <div style={navbar}>
        <span style={liveDot}>● LIVE</span>

        <span style={brand}>QueueSense</span>

        <div style={navRight}>
          <button
            style={backBtn}
            onClick={() =>
              navigate(role === "admin" ? "/dashboard" : "/user-dashboard")
            }
          >
            ← Dashboard
          </button>

          <span style={navBadge}>Live Display</span>
        </div>
      </div>

      {/* MAIN CARD */}
      <div style={card}>
        <p style={cardLabel}>QUEUE STATUS</p>

        <h1 style={cardTitle}>{queue.name}</h1>

        <p style={{ color: "#6c63ff", fontWeight: "600" }}>
          {queue.organization}
        </p>

        <div style={divider} />

        <div style={numberBox}>{queue.currentLength}</div>
        <p style={subText}>People Currently in Queue</p>

        <div style={statsRow}>
          <div style={statChip}>
            <span style={statChipLabel}>ESTIMATED WAIT</span>
            <span style={statChipValue}>
              {waitMins} min{waitMins !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            style={{
              ...statChip,
              background: queue.isPaused ? "#fee2e2" : "#e6f9f0",
              border: "1px solid",
              borderColor: queue.isPaused ? "#f87171" : "#4ade80",
            }}
          >
            <span style={statChipLabel}>STATUS</span>
            <span
              style={{
                ...statChipValue,
                color: queue.isPaused ? "#dc2626" : "#16a34a",
              }}
            >
              {queue.isPaused ? "Paused" : "Active"}
            </span>
          </div>
        </div>

        {queue.currentLength > queue.maxCapacity * 0.8 && (
          <div style={alertBox}>
            ⚠ Queue is Overcrowded
          </div>
        )}
      </div>

      <p style={footer}>Auto-refreshes every 3 seconds</p>
    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  fontFamily: "'Poppins', sans-serif",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at 30% 30%, #ede9fe, transparent 40%), radial-gradient(circle at 70% 70%, #fce7f3, transparent 40%), linear-gradient(135deg, #f5f3ff, #fdf2f8)",
};

const navbar = {
  position: "absolute",
  top: 0,
  width: "100%",
  padding: "12px 30px",
  background: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
};

const brand = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#6c63ff",
};

const navBadge = {
  fontSize: "11px",
  background: "#ede9fe",
  padding: "4px 10px",
  borderRadius: "999px",
};

const liveDot = {
  color: "#16a34a",
  fontSize: "12px",
  fontWeight: "600",
};

const navRight = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const backBtn = {
  padding: "6px 12px",
  border: "none",
  background: "#6c63ff",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
};

const card = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(12px)",
  padding: "40px",
  borderRadius: "22px",
  width: "380px",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
};

const cardLabel = {
  fontSize: "11px",
  color: "#a78bfa",
  letterSpacing: "1px",
};

const cardTitle = {
  fontSize: "26px",
  fontWeight: "700",
  marginTop: "5px",
};

const divider = {
  height: "2px",
  width: "40px",
  background: "#6c63ff",
  margin: "10px auto",
  borderRadius: "10px",
};

const numberBox = {
  fontSize: "72px",
  fontWeight: "800",
  color: "#5b5bf7",
  margin: "10px 0",
};

const subText = {
  color: "#6b7280",
  fontSize: "13px",
};

const statsRow = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  marginTop: "15px",
};

const statChip = {
  padding: "14px 20px",
  borderRadius: "14px",
  background: "#f4f3ff",
  minWidth: "140px",
};

const statChipLabel = {
  fontSize: "10px",
  display: "block",
  color: "#6b7280",
};

const statChipValue = {
  fontSize: "16px",
  fontWeight: "600",
};

const alertBox = {
  marginTop: "15px",
  color: "#dc2626",
  fontWeight: "600",
};

const footer = {
  marginTop: "25px",
  fontSize: "11px",
  color: "#9ca3af",
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loadingCard = {
  padding: "30px",
  background: "white",
  borderRadius: "10px",
};

const spinnerStyle = {
  width: "30px",
  height: "30px",
  border: "3px solid #ccc",
  borderTop: "3px solid #6c63ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const loadingText = {
  marginTop: "10px",
};

export default PublicDisplay;