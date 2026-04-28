import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function QueuePage() {
  const { id: queueId } = useParams();
  const navigate = useNavigate();
  const [queue, setQueue] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/queue/${queueId}`
      );
      setQueue(res.data.queue || res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // ✅ FIXED
  const addPerson = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/queueOps/${queueId}/add`
      );
      fetchQueue();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
    }
  };

  // ✅ FIXED
  const serveNext = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/queueOps/${queueId}/serve`
      );
      fetchQueue();
    } catch (err) {
      console.log("SERVE ERROR:", err.response?.data || err.message);
    }
  };

  // ✅ FIXED
  const resetQueue = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/queueOps/${queueId}/reset`
      );
      setQueue(res.data.queue || res.data);
    } catch (err) {
      console.log("RESET ERROR:", err.response?.data || err.message);
    }
  };

  // ✅ FIXED
  const togglePause = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/queueOps/${queueId}/pause`
      );
      fetchQueue();
    } catch (err) {
      console.log("PAUSE ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!queueId) return;
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [queueId]);

  if (!queue) {
    return (
      <div style={loadingWrap}>
        <div style={spinner}></div>
      </div>
    );
  }

  const waitMins =
    queue.serviceRate > 0
      ? Math.ceil(queue.currentLength / queue.serviceRate)
      : 0;

  const percent =
    (queue.currentLength / queue.maxCapacity) * 100;

  return (
    <div style={page}>
      <div style={container}>
        <div style={navbar}>
          <span style={live}>● LIVE</span>

          <span style={logo}>QueueSense</span>

          <div style={navRight}>
            <span
              style={navBtn}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>

            <span
              style={settingsBtn}
              onClick={() =>
                navigate(`/queue/${queueId}/settings`)
              }
            >
              ⚙ Settings
            </span>
          </div>
        </div>

        <div style={centerWrap}>
          <div style={card}>
            <p style={tag}>QUEUE MANAGEMENT</p>
            <h1 style={title}>{queue.name}</h1>

            <div style={grid}>
              <div style={box}>
                <p style={label}>IN QUEUE</p>
                <h2 style={value}>{queue.currentLength}</h2>
              </div>

              <div style={box}>
                <p style={label}>MAX CAPACITY</p>
                <h2 style={value}>{queue.maxCapacity}</h2>
              </div>

              <div style={box}>
                <p style={label}>WAIT TIME</p>
                <h2 style={value}>{waitMins}m</h2>
              </div>

              <div style={statusBox}>
                <p style={label}>STATUS</p>
                <h2 style={status}>
                  {queue.isPaused ? "Paused" : "Active"}
                </h2>
              </div>
            </div>

            <div style={capacityWrap}>
              <div style={capText}>
                <span>Capacity</span>
                <span>{percent.toFixed(0)}%</span>
              </div>

              <div style={bar}>
                <div
                  style={{ ...fill, width: `${percent}%` }}
                />
              </div>
            </div>

            <div style={btnGrid}>
              <button style={btnPurple} onClick={addPerson}>
                + Add Person
              </button>

              <button style={btnBlue} onClick={serveNext}>
                − Serve Next
              </button>

              <button style={btnOrange} onClick={resetQueue}>
                Reset Queue
              </button>

              <button style={btnPink} onClick={togglePause}>
                {queue.isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// styles unchanged
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ece6ff, #ffd9ea)",
  display: "flex",
  justifyContent: "center",
};

const container = {
  fontFamily: "'Poppins', sans-serif",
  width: "100%",
  maxWidth: "1100px",
};

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 10px",
};

const live = { color: "#00c853" };

const logo = {
  fontWeight: "600",
  color: "#6c63ff",
};

const navRight = {
  display: "flex",
  gap: "10px",
};

const navBtn = {
  background: "#f0ebff",
  padding: "6px 12px",
  borderRadius: "12px",
  cursor: "pointer",
};

const settingsBtn = {
  background: "#ffe8f0",
  padding: "6px 12px",
  borderRadius: "12px",
  color: "#ff6f91",
  cursor: "pointer",
};

const centerWrap = {
  display: "flex",
  justifyContent: "center",
  marginTop: "40px",
};

const card = {
  background: "#fff",
  padding: "32px",
  borderRadius: "24px",
  width: "420px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const tag = {
  fontSize: "11px",
  color: "#999",
  letterSpacing: "1px",
};

const title = {
  margin: "8px 0 20px",
  fontWeight: "700",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const box = {
  background: "#f7f6ff",
  padding: "14px",
  borderRadius: "12px",
};

const statusBox = {
  background: "#eafff2",
  padding: "14px",
  borderRadius: "12px",
};

const label = {
  fontSize: "11px",
  color: "#888",
};

const value = {
  color: "#6c63ff",
  fontWeight: "600",
};

const status = {
  color: "#00c853",
  fontWeight: "600",
};

const capacityWrap = {
  marginTop: "25px",
};

const capText = {
  display: "flex",
  justifyContent: "space-between",
};

const bar = {
  height: "6px",
  background: "#eee",
  borderRadius: "10px",
};

const fill = {
  height: "100%",
  background: "#6c63ff",
};

const btnGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "20px",
};

const btnPurple = {
  background: "#6c63ff",
  color: "#fff",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
};

const btnBlue = {
  background: "#0072ff",
  color: "#fff",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
};

const btnOrange = {
  background: "#ff9800",
  color: "#fff",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
};

const btnPink = {
  background: "#ff6f91",
  color: "#fff",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
};

const loadingWrap = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const spinner = {
  width: "30px",
  height: "30px",
  border: "3px solid #ccc",
  borderTop: "3px solid #6c63ff",
  borderRadius: "50%",
};

export default QueuePage;