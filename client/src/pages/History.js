import React, { useEffect, useState } from "react";
import QueueChart from "../components/QueueChart";
import historyData from "../assets/historyData";
import "./History.css";
import Heatmap from "../components/Heatmap";

const History = () => {
  const [filter, setFilter] = useState("7");
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("▼");
  const [isManualDate, setIsManualDate] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    setHistory(historyData);

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  // FILTER LOGIC
  const getFilteredData = () => {
    let temp = [...history];

    // APPLY BUTTON FILTER ONLY
    if (filter === "7") return temp.slice(-7);
    if (filter === "30") return temp.slice(-30);

    if (filter === "YEAR") {
      const currentYear = new Date().getFullYear();
      return temp.filter(
        item => new Date(item.date).getFullYear() === currentYear
      );
    }

    if (filter === "ALL") return temp;

    // APPLY DATE RANGE ONLY WHEN NO BUTTON ACTIVE
    if (isManualDate && startDate && endDate) {
      return temp.filter(item => {
        const d = new Date(item.date);
        return d >= new Date(startDate) && d <= new Date(endDate);
      });
    }

    return temp;
  };
  const filteredData = getFilteredData();

  // PAGINATION (USE FILTERED DATA)
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  let tableData = [...history];

  //  SEARCH
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

  // SORT
  tableData.sort((a, b) => {
    return sortOrder === "▲"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  // PAGINATION
  const currentData = tableData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tableData.length / rowsPerPage) || 1;

  // Stats
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

  // INSIGHTS
  const getDayName = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  // Most busy day of week
  const dayMap = {};
  history.forEach(h => {
    const day = getDayName(h.date);
    dayMap[day] = (dayMap[day] || 0) + h.length;
  });

  const busiestDay = Object.keys(dayMap).reduce((a, b) =>
    dayMap[a] > dayMap[b] ? a : b,
    "N/A"
  );

  // Growth %
  const first = history[0]?.length || 0;
  const last = history[history.length - 1]?.length || 0;
  const growth =
    first === 0 ? 0 : (((last - first) / first) * 100).toFixed(1);

  // Peak hour pattern (mock insight)
  const peakType =
    avgQueue > 20 ? "Consistently High Load 🚨" :
    avgQueue > 12 ? "Moderate Traffic ⚠️" :
    "Mostly Low Traffic ✅";

  // Spike detection
  const spikes = history.filter(h => h.length > avgQueue * 1.5).length;

  return (
    <div className="history-container fade-in">

      <h1>Queue History Dashboard</h1>

      {/* Stats */}
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

      {/* Filters */}
      <div className="filters">
      <div className="left-filters">
        <button
  className={filter === "7" ? "active" : ""}
        onClick={() => {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 6);

          setFilter("7");
          setIsManualDate(false);
          setStartDate(start.toISOString().split("T")[0]);
          setEndDate(end.toISOString().split("T")[0]);
        }}
      >
        Last 7 Days
      </button>

      <button className={filter === "30" ? "active" : ""} onClick={() => {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 29);
          setFilter("30");
          setIsManualDate(false);
          setStartDate(start.toISOString().split("T")[0]);
          setEndDate(end.toISOString().split("T")[0]);
          }}>Last 30 Days
      </button>
      <button className={filter === "YEAR" ? "active" : ""} onClick={() => {
          const now = new Date();
          const start = new Date(now.getFullYear(), 0, 1);
          const end = new Date();
          setFilter("YEAR");
          setIsManualDate(false);
          setStartDate(start.toISOString().split("T")[0]);
          setEndDate(end.toISOString().split("T")[0]);
        }}>Current Year
      </button>
      <button className={filter === "ALL" ? "active" : ""} onClick={() => {
          if (history.length > 0) {
            const sorted = [...history].sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            const first = new Date(sorted[0].date);
            const last = new Date(sorted[sorted.length - 1].date);
            setStartDate(first.toISOString().split("T")[0]);
            setEndDate(last.toISOString().split("T")[0]);
          }
          setFilter("ALL");
          setIsManualDate(false);
        }}>All
      </button>
      </div>
      {/* RIGHT SIDE DATE FILTER */}
      <div className="right-filters">
        <div className="date-box">
          <input type="date" value={startDate} onChange={(e) => {
            setStartDate(e.target.value);
            setIsManualDate(true);}}
          />
        </div>
        <span className="date-separator">→</span>
        <div className="date-box">
          <input type="date" value={endDate} onChange={(e) => {
            setEndDate(e.target.value);
            setIsManualDate(true);}}
          />
        </div>
      </div>
    </div>

      {/* Charts */}
      {filteredData.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "20px",
          color: "#6b7280",
          fontStyle: "italic"
        }}>
          No data available
        </div>
      )}

      <QueueChart data={filteredData} />
      <Heatmap data={filteredData} />

      {/* Insights + Doughnut */}
      <div className="insight-row">
        <div className="insights glass-card">
          <h2>Insights</h2>
          <ul>
            <li>📅 Busiest Day: {busiestDay}</li>
            <li>📈 Growth Trend: {growth}%</li>
            <li>🔥 Peak Queue: {peakDay?.length} on {peakDay?.date}</li>
            <li>📊 Avg Queue: {avgQueue}</li>
            <li>⚠ Spikes Detected: {spikes} days</li>
            <li>🧠 Pattern: {peakType}</li>
          </ul>
        </div>

        <div className="side-chart glass-card">
          <h3 className="chart-title">Queue Distribution</h3>
          <div className="doughnut-wrapper">
            <QueueChart data={filteredData} showOnlyDoughnut />
          </div>
        </div>
      </div>

      <div className="table-controls">
        <input type="text" placeholder="Search (e.g. 05 Jan 26)" value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button onClick={() => setSortOrder(prev => (prev === "▲" ? "▼" : "▲"))}>Sort: {sortOrder}</button>
      </div>

      {/* Table */}
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
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index}>
                  <td>
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                  <td>{item.length}</td>
                  <td>{item.waitTime} min</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
            ◀ Prev
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
            Next ▶
          </button>
        </div>
      </div>

    </div>
  );
};

export default History;