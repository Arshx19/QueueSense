import React, { useEffect, useState } from "react";
import QueueChart from "../components/QueueChart";
import Heatmap from "../components/Heatmap";
import "./History.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("7");
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/history/user/${user._id}`
        );

        const formatted = (res.data || []).map(item => ({
          date: item.createdAt?.split("T")[0],
          length: item.queueLength || 0,
          waitTime: item.waitTime || 0
        }));

        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);

        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(end.toISOString().split("T")[0]);

        setHistory(formatted);

      } catch (err) {
        console.log(err);
        setHistory([]);
      }
    };

    fetchHistory();
  }, [navigate]);

  const getFilteredData = () => {
    let temp = [...history];

    if (filter) {
      if (filter === "7") return temp.slice(-7);
      if (filter === "30") return temp.slice(-30);

      if (filter === "YEAR") {
        const year = new Date().getFullYear();
        return temp.filter(i => new Date(i.date).getFullYear() === year);
      }

      if (filter === "ALL") return temp;
    }

    if (!filter && startDate && endDate) {
      return temp.filter(i => {
        const d = new Date(i.date);
        return d >= new Date(startDate) && d <= new Date(endDate);
      });
    }

    return temp;
  };

  const filteredData = getFilteredData();

  const peak = history.length ? Math.max(...history.map(h => h.length)) : 0;

  const avgWait = history.length
    ? (history.reduce((s, h) => s + h.waitTime, 0) / history.length).toFixed(1)
    : 0;

  return (
    <div className="history-container fade-in">

      {/* HEADER */}
      <div style={{ marginBottom: "20px" }}>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h1>Queue History Dashboard</h1>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="card glass-card">
          <h3>🔥 Peak</h3>
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

      {/* ✅ FILTERS MOVED HERE */}
      <div className="filters">

        <div className="left-filters">
          <button className={filter === "7" ? "active" : ""} onClick={() => setFilter("7")}>
            Last 7 Days
          </button>

          <button className={filter === "30" ? "active" : ""} onClick={() => setFilter("30")}>
            Last 30 Days
          </button>

          <button className={filter === "YEAR" ? "active" : ""} onClick={() => setFilter("YEAR")}>
            Current Year
          </button>

          <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>
            All
          </button>
        </div>

        <div className="right-filters">

          <div className="date-box">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setFilter("");
              }}
            />
          </div>

          <span className="date-separator">→</span>

          <div className="date-box">
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFilter("");
              }}
            />
          </div>

        </div>

      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          No history data available
        </div>
      ) : (
        <>
          {/* CHARTS */}
          <QueueChart data={filteredData} selectedDate={selectedDate} />

          <Heatmap
            data={history}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />

          {/* TABLE */}
          <div className="table-box">
            <h2>Queue Activity</h2>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Queue Length</th>
                  <th>Wait Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item, index) => (
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