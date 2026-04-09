import React, { useState, useRef, useEffect } from "react";
import "./Heatmap.css";

const Heatmap = ({ data, onSelectDate, selectedDate }) => {
  const containerRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  useEffect(() => {
    if (!selectedDate) {
        setSelected(null);
    }
  }, [selectedDate]);

  //     NO DATA
  if (!data || data.length === 0) {
    return <div className="heatmap-empty">No data</div>;
  }

  // FILTER BY YEAR
  const filteredByYear = data.filter(
    item => new Date(item.date).getFullYear() === year
  );

  // SORT
  const sorted = [...filteredByYear].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // NO DATA FOR YEAR
  if (sorted.length === 0) {
    return (
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h3 className="heatmap-title">Queue Activity Heatmap</h3>

          <div className="year-controls">
            <button onClick={() => setYear(y => y - 1)}>◀</button>
            <span>{year}</span>
            <button onClick={() => setYear(y => y + 1)}>▶</button>
          </div>
        </div>

        <div className="heatmap-empty">No data for this year</div>
      </div>
    );
  }

  // COLOR SCALE
  const values = sorted.map(d => d.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const getColor = (value) => {
    const ratio = (value - min) / (max - min || 1);

    if (ratio < 0.2) return "#ede9fe";
    if (ratio < 0.4) return "#c4b5fd";
    if (ratio < 0.6) return "#a78bfa";
    if (ratio < 0.8) return "#7c3aed";
    return "#5b21b6";
  };

  // MONTH ORDER
  const monthOrder = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // GROUP BY MONTH
  const groupedByMonth = {};
  monthOrder.forEach(m => (groupedByMonth[m] = []));

  sorted.forEach(item => {
    const date = new Date(item.date);
    const month = date.toLocaleString("default", { month: "long" });
    groupedByMonth[month].push(item);
  });

  return (
    <div className="heatmap-container" ref={containerRef}>
      
      {/* HEADER */}
      <div className="heatmap-header">
        <h3 className="heatmap-title">Queue Activity</h3>
        {/* SELECTED INFO */}
        {selected && (
            <div className="heatmap-info">
            {new Date(selected.date).toLocaleDateString("en-GB")} →{" "}
            <b>{selected.length}</b> people
            </div>
        )}
        <div className="year-controls">
          <button onClick={() => setYear(y => y - 1)}>◀</button>
          <span>{year}</span>
          <button onClick={() => setYear(y => y + 1)}>▶</button>
        </div>
      </div>

      {/* HEATMAP */}
      <div className="heatmap-scroll">
        <div className="heatmap-wrapper">

          {/* DAYS COLUMN */}
          <div className="heatmap-days">
            {days.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          {/* MONTHS */}
          <div className="heatmap-months">
            {monthOrder.map(month => {
              const items = groupedByMonth[month];
              if (items.length === 0) return null;

              const weeks = [];
              let week = new Array(7).fill(null);

              items.forEach(item => {
                const d = new Date(item.date);
                const day = d.getDay();
                week[day] = item;

                if (day === 6) {
                  weeks.push(week);
                  week = new Array(7).fill(null);
                }
              });

              if (week.some(d => d !== null)) weeks.push(week);

              return (
                <div key={month} className="heatmap-month">
                  <div className="month-title">{month}</div>

                  <div className="heatmap-weeks">
                    {weeks.map((week, wIndex) => (
                      <div key={wIndex} className="heatmap-week">

                        {week.map((day, dIndex) => (
                          <div
                            key={dIndex}
                            className={`heatmap-cell ${
                              day &&
                              selectedDate &&
                              new Date(selectedDate).toDateString() ===
                                new Date(day.date).toDateString()
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: day
                                ? getColor(day.length)
                                : "#f1f5f9"
                            }}

                            // CLICK
                            onClick={() => {
                              if (!day) return;
                              setSelected(day);
                              onSelectDate(day.date);
                            }}

                            // TOOLTIP
                            onMouseMove={(e) => {
                              if (!day || !containerRef.current) return;

                              const rect = containerRef.current.getBoundingClientRect();

                              setTooltip({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                                data: day
                              });
                            }}

                            onMouseLeave={() => setTooltip(null)}
                          />
                        ))}

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* TOOLTIP */}
      {tooltip?.data && (
        <div
          className="heatmap-global-tooltip"
          style={{
            top: tooltip.y,
            left: tooltip.x,
          }}
        >
          {new Date(tooltip.data.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })}
          <br />
          {tooltip.data.length} people
        </div>
      )}

      {/* LEGEND */}
      <div className="heatmap-legend">
        <span>Low</span>
        <div className="legend-box" style={{ background: "#ede9fe" }}></div>
        <div className="legend-box" style={{ background: "#c4b5fd" }}></div>
        <div className="legend-box" style={{ background: "#a78bfa" }}></div>
        <div className="legend-box" style={{ background: "#7c3aed" }}></div>
        <div className="legend-box" style={{ background: "#5b21b6" }}></div>
        <span>High</span>
      </div>

    </div>
  );
};

export default Heatmap;