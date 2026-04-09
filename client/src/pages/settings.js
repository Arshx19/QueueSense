import React, { useState } from "react";

function Settings() {
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    serviceRate: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to right, #f5f7fa, #e4ecf7)", // 👈 same vibe as landing
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "15px",
          background: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Queue Settings
        </h1>

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: "18px" }}>
            <label style={{ color: "#555", fontSize: "14px" }}>
              Queue Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter queue name"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ color: "#555", fontSize: "14px" }}>
              Max Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#555", fontSize: "14px" }}>
              Service Rate
            </label>
            <input
              type="number"
              name="serviceRate"
              value={form.serviceRate}
              onChange={handleChange}
              placeholder="Customers per hour"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "14px",
};

export default Settings;