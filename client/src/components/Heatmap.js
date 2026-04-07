import React, { useState, useRef } from "react";
import "./Heatmap.css";


const Heatmap = ({ data }) => {
  const containerRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  if (!data || data.length === 0) {
    return <div className="heatmap-empty">No data</div>;
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

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

  const weeks = [];
  let week = new Array(7).fill(null);

  sorted.forEach((item) => {
    const date = new Date(item.date);
    const day = date.getDay();

    week[day] = item;

    if (day === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  });

  if (week.some(d => d !== null)) weeks.push(week);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="heatmap-container" ref={containerRef}>

      <h3 className="heatmap-title">Queue Activity Heatmap</h3>

      <div className="heatmap-scroll">
        <div className="heatmap-wrapper">

          <div className="heatmap-days">
            {days.map(d => <span key={d}>{d}</span>)}
          </div>

          <div className="heatmap-weeks">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="heatmap-week">
                {week.map((day, dIndex) => (
                  <div
                    key={dIndex}
                    className={`heatmap-cell ${
                      day && selected?.date === day.date ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor: day ? getColor(day.length) : "#f1f5f9"
                    }}
                    onClick={() => day && setSelected(day)}

                    onMouseMove={(e) => {
                        if (!day) return;
                        const rect = containerRef.current.getBoundingClientRect();
                        setTooltip({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                            data: day,
                        });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ✅ GLOBAL TOOLTIP */}
      {tooltip && (
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

      {/* Selected info */}
      {selected && (
        <div className="heatmap-info">
          📅 {new Date(selected.date).toLocaleDateString("en-GB")} →{" "}
          <b>{selected.length}</b> people
        </div>
      )}

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