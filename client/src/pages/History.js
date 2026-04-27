import React, { useEffect, useState } from "react";
import QueueChart from "../components/QueueChart";
import "./History.css";
import Heatmap from "../components/Heatmap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          navigate("/");
          return;
        }

        console.log("USER ID:", user._id);

        // ✅ FIXED API
        const res = await axios.get(
          `http://localhost:5000/api/history/user/${user._id}`
        );

        console.log("HISTORY RESPONSE:", res.data);

        const formatted = res.data.map(item => ({
          date: item.createdAt.split("T")[0],
          length: item.queueLength || 0,
          waitTime: item.waitTime || 0
        }));

        setHistory(formatted);

      } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        setHistory([]);
      }
    };

    fetchHistory();
  }, [navigate]);

  const peak = history.length ? Math.max(...history.map(h => h.length)) : 0;

  const avgWait = history.length
    ? (
        history.reduce((sum, h) => sum + h.waitTime, 0) /
        history.length
      ).toFixed(1)
    : 0;

  return (
    <div className="history-container fade-in">

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "8px 14px",
            background: "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>Queue History Dashboard</h1>
      </div>

      <div className="stats">
        <div className="card glass-card">
          <h3>🔥 Peak Queue</h3>
          <p>{peak}</p>
        </div>

        <div className="card glass-card">
          <h3>⏱ Avg Wait</h3>
          <p>{avgWait} min</p>
        </div>

        <div className="card glass-card">
          <h3>📊 Records</h3>
          <p>{history.length}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>No history data available</h2>
          <p>Start joining queues to see analytics here.</p>
        </div>
      ) : (
        <>
          <QueueChart data={history} selectedDate={selectedDate} />

          <Heatmap
            data={history}
            onSelectDate={(date) => setSelectedDate(date)}
            selectedDate={selectedDate}
          />

          <div className="table-box">
            <h2>History Table</h2>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Queue Length</th>
                  <th>Wait Time</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.length}</td>
                    <td>{item.waitTime} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default History;