import React, { useState, useEffect } from "react";
import axios from "axios";

function QueuePage() {
  const queueId = "69d1272a28c3b992848f27de";

  const [queue, setQueue] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/queue/${queueId}`
      );
      setQueue(res.data.queue);
    } catch (err) {
      console.error(err);
    }
  };

  const addPerson = async () => {
    await axios.post(
      `http://localhost:5000/api/queue/${queueId}/add`
    );
    fetchQueue();
  };

  const serveNext = async () => {
    await axios.post(
      `http://localhost:5000/api/queue/${queueId}/serve`
    );
    fetchQueue();
  };

  const resetQueue = async () => {
    await axios.post(
      `http://localhost:5000/api/queue/${queueId}/reset`
    );
    fetchQueue();
  };

  const togglePause = async () => {
    await axios.post(
      `http://localhost:5000/api/queue/${queueId}/pause`
    );
    fetchQueue();
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!queue)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center"
        }}
      >
        <h1 style={{ marginBottom: "10px", color: "#4f46e5" }}>
          Queue Management
        </h1>

        <h2 style={{ margin: "15px 0" }}>
          Queue Length: {queue.currentLength}
        </h2>

        <p>
          <strong>Max Capacity:</strong> {queue.maxCapacity}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color: queue.isPaused ? "#ef4444" : "#22c55e",
              fontWeight: "bold"
            }}
          >
            {queue.isPaused ? "Paused" : "Active"}
          </span>
        </p>

        {queue.currentLength > queue.maxCapacity * 0.8 && (
          <p
            style={{
              color: "#ef4444",
              fontWeight: "bold",
              marginTop: "10px"
            }}
          >
            ⚠ Overcrowded!
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <button style={btnStyle} onClick={addPerson} disabled={queue.isPaused}>
            ➕ Add
          </button>

          <button style={btnStyle} onClick={serveNext}>
            ➖ Serve
          </button>

          <button style={btnStyle} onClick={resetQueue}>
            🔁 Reset
          </button>

          <button style={btnStyle} onClick={togglePause}>
            {queue.isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Button style (reusable)
const btnStyle = {
  margin: "6px",
  padding: "10px 14px",
  border: "none",
  borderRadius: "6px",
  background: "#6366f1",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.2s"
};

export default QueuePage;