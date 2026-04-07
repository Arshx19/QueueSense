import React from "react";
import "./Heatmap.css";

const Heatmap = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="heatmap-empty">No data</div>;
  }

  // Normalize values for color scaling
  const max = Math.max(...data.map(d => d.length));
  const min = Math.min(...data.map(d => d.length));

  const getColor = (value) => {
    const ratio = (value - min) / (max - min || 1);

    if (ratio < 0.2) return "#e0e7ff";
    if (ratio < 0.4) return "#a5b4fc";
    if (ratio < 0.6) return "#818cf8";
    if (ratio < 0.8) return "#6366f1";
    return "#4338ca";
  };

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">Queue Activity Heatmap</h3>

      <div className="heatmap-grid">
        {data.map((item, index) => (
          <div
            key={index}
            className="heatmap-cell"
            style={{ backgroundColor: getColor(item.length) }}
            title={`${item.date} → ${item.length} people`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;