import React, { useEffect, useState } from "react";
import QueueChart from "../components/QueueChart";
import historyData from "../assets/historyData";
import "./History.css";
import Heatmap from "../components/Heatmap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("7");
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("▼");
  const [isManualDate, setIsManualDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const rowsPerPage = 10;
  const queueId = "69d88649a430aa7c333caf5e";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${queueId}`);
        let data = res.data;

        if (!data || data.length === 0) {
          data = historyData;
        }

        const formatted = data.map(item => ({
          date: item.timestamp
            ? item.timestamp.split("T")[0]
            : item.date,
          length: item.length,
          waitTime: item.waitTime
        }));

        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);

        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(end.toISOString().split("T")[0]);

        setHistory(formatted);

      } catch (err) {
        console.error(err);
        setHistory(historyData);
      }
    };

    fetchHistory();
  }, []);

  const getFilteredData = () => {
    let temp = [...history];

    if (filter === "7") return temp.slice(-7);
    if (filter === "30") return temp.slice(-30);

    if (filter === "YEAR") {
      const currentYear = new Date().getFullYear();
      return temp.filter(
        item => new Date(item.date).getFullYear() === currentYear
      );
    }

    if (filter === "ALL") return temp;

    if (isManualDate && startDate && endDate) {
      return temp.filter(item => {
        const d = new Date(item.date);
        return d >= new Date(startDate) && d <= new Date(endDate);
      });
    }

    return temp;
  };

  const filteredData = getFilteredData();

  const getChartData = () => {
    if (!selectedDate) return filteredData;
    const selected = new Date(selectedDate);
    return history.filter(item => {
      const d = new Date(item.date);
      const diff = (d - selected) / (1000 * 60 * 60 * 24);
      return diff >= -3 && diff <= 3;
    });
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  let tableData = [...history];

  if (search) {
    tableData = tableData.filter(item =>
      new Date(item.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  tableData.sort((a, b) => {
    return sortOrder === "▲"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  const currentData = tableData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tableData.length / rowsPerPage) || 1;

  const peak = history.length ? Math.max(...history.map(h => h.length)) : 0;
  const avgWait = history.length
    ? (history.reduce((sum, h) => sum + h.waitTime, 0) / history.length).toFixed(1)
    : 0;

  const peakDay = history.reduce((max, curr) =>
    curr.length > (max?.length || 0) ? curr : max,
    {}
  );

  const avgQueue = history.length
    ? (
        history.reduce((sum, h) => sum + h.length, 0) /
        history.length
      ).toFixed(1)
    : 0;

  const getDayName = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  const dayMap = {};
  history.forEach(h => {
    const day = getDayName(h.date);
    dayMap[day] = (dayMap[day] || 0) + h.length;
  });

  const busiestDay = Object.keys(dayMap).reduce((a, b) =>
    dayMap[a] > dayMap[b] ? a : b,
    "N/A"
  );

  const first = history[0]?.length || 0;
  const last = history[history.length - 1]?.length || 0;
  const growth =
    first === 0 ? 0 : (((last - first) / first) * 100).toFixed(1);

  const peakType =
    avgQueue > 20 ? "Consistently High Load 🚨" :
    avgQueue > 12 ? "Moderate Traffic ⚠️" :
    "Mostly Low Traffic ✅";

  const spikes = history.filter(h => h.length > avgQueue * 1.5).length;

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

      <QueueChart data={getChartData()} selectedDate={selectedDate} />
      <Heatmap data={history} onSelectDate={(date) => setSelectedDate(date)} selectedDate={selectedDate} />

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
            {currentData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.length}</td>
                <td>{item.waitTime} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;