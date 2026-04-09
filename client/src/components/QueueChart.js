import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import "./QueueChart.css";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const QueueChart = ({ data, showOnlyDoughnut, selectedDate }) => {
  const safeData =
    data && data.length > 0
      ? data
      : [
          {
            date: new Date().toISOString().split("T")[0],
            length: 0,
            waitTime: 0,
          },
        ];

  // Prediction
  const prediction = safeData.map((d, i, arr) => {
    if (i < 2) return null;
    return (
      (arr[i].length + arr[i - 1].length + arr[i - 2].length) / 3
    );
  });

  // Labels (formatted)
  const labels = safeData.map(d =>
    new Date(d.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
  );

  const selectedIndex = data.findIndex(
    d => selectedDate && new Date(d.date).toDateString() === new Date(selectedDate).toDateString()
  );

  // Peak index
  const peakIndex = safeData.findIndex(
    d => d.length === Math.max(...safeData.map(x => x.length))
  );

  // LINE CHART
  const lineData = {
    labels,
    datasets: [
      {
        label: "Queue Length",
        data: data.map(d => d.length),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.2)",
        tension: 0.4,
        pointBackgroundColor: data.map((_, i) => {
          if (i === selectedIndex) return "#6c63ff"; // selected
          if (i === peakIndex) return "#ef4444";     // peak
          return "#14b8a6";
        }),
        pointRadius: data.map((_, i) => i === selectedIndex ? 7 : i === peakIndex ? 5 : 3),
        pointBorderWidth: data.map((_, i) => i === selectedIndex ? 3 : 1 ),
        pointBorderColor: data.map((_, i) => i === selectedIndex ? "#fff" : "#14b8a6"),
      },
      {
        label: "Prediction",
        data: prediction,
        borderColor: "#f59e0b",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeInOutCubic",
    },
    plugins: {
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        borderColor: "#6366f1",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `Queue Length: ${context.raw} people`;
          },
        },
      },
      legend: {
        labels: {
          color: "#374151",
          font: { size: 13 },
        },
      },
    },
  };

  // BAR CHART
  const barData = {
    labels,
    datasets: [
      {
        label: "Wait Time",
        data: safeData.map(d => d.waitTime),
        backgroundColor: data.map((_, i) => i === selectedIndex ? "#6c63ff" : "#3b82f6"),
        borderRadius: 8,
        hoverBackgroundColor: "#2563eb",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeInOutCubic",
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Wait Time: ${context.raw} min`;
          },
        },
      },
    },
  };

  // DOUGHNUT
  const veryLow = safeData.filter(d => d.length <= 8).length;
  const low = safeData.filter(d => d.length > 8 && d.length <= 15).length;
  const medium = safeData.filter(d => d.length > 15 && d.length <= 22).length;
  const high = safeData.filter(d => d.length > 22 && d.length <= 28).length;
  const veryHigh = safeData.filter(d => d.length > 28).length;

  const doughnutData = {
    labels: [
      "Very Low (0–8)",
      "Low (9–15)",
      "Medium (16–22)",
      "High (23–28)",
      "Very High (29+)",
    ],
    datasets: [
      {
        data: [veryLow, low, medium, high, veryHigh],
        backgroundColor: [
          "#22c55e",
          "#84cc16",
          "#f59e0b",
          "#f97316",
          "#ef4444",
        ],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    animation: {
      animateRotate: true,
      duration: 800,
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 14,
          padding: 18,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} days`;
          },
        },
      },
    },
  };

  // Doughnut only mode
  if (showOnlyDoughnut) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-box">
        <h3>Queue Trend</h3>
        <div className="chart-inner">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="chart-box">
        <h3>Wait Time</h3>
        <div className="chart-inner">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default QueueChart;