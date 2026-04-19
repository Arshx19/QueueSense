import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [queues, setQueues] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    maxCapacity: "",
    serviceRate: "",
  });

  const navigate = useNavigate();

  const fetchQueues = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queue");
      setQueues(res.data);
    } catch (err) {
      console.error(err);
      setQueues([]);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createQueue = async () => {
    try {
      await axios.post("http://localhost:5000/api/queue/create", form);
      setShowForm(false);
      setForm({ name: "", maxCapacity: "", serviceRate: "" });
      fetchQueues();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQueue = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/queue/${id}`);
      fetchQueues();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={container}>
      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={logo}>QueueSense</h2>

        <p style={sideItem}>Dashboard</p>

        <p style={sideItem} onClick={() => navigate("/history")}>
          History
        </p>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={main}>
        <h1 style={title}>Dashboard</h1>

        <button style={createBtn} onClick={() => setShowForm(!showForm)}>
          + Create Queue
        </button>

        {showForm && (
          <div style={formBox}>
            <input
              name="name"
              placeholder="Queue Name"
              value={form.name}
              onChange={handleChange}
              style={input}
            />
            <input
              name="maxCapacity"
              placeholder="Max Capacity"
              value={form.maxCapacity}
              onChange={handleChange}
              style={input}
            />
            <input
              name="serviceRate"
              placeholder="Service Rate"
              value={form.serviceRate}
              onChange={handleChange}
              style={input}
            />

            <button style={submitBtn} onClick={createQueue}>
              Create
            </button>
          </div>
        )}

        {/* QUEUE CARDS */}
        <div style={grid}>
          {queues.map((q) => (
            <div
              key={q._id}
              style={card}
              onClick={() => navigate(`/queue/${q._id}`)}
            >
              <h3>{q.name}</h3>
              <p>People: {q.currentLength}</p>
              <p>Wait: {q.waitTime} mins</p>

              {/* DELETE BUTTON */}
              <button
                style={deleteBtn}
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevents card click
                  deleteQueue(q._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const container = {
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ece6ff, #ffd9ea)",
};

const sidebar = {
  width: "220px",
  padding: "20px",
  background: "#fff",
  boxShadow: "0 0 20px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
};

const logo = {
  color: "#6c63ff",
  marginBottom: "20px",
};

const sideItem = {
  marginBottom: "12px",
  cursor: "pointer",
};

const logoutBtn = {
  marginTop: "auto",
  padding: "10px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const main = {
  flex: 1,
  padding: "30px",
};

const title = {
  marginBottom: "20px",
};

const createBtn = {
  background: "#6c63ff",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const formBox = {
  marginTop: "15px",
  display: "flex",
  gap: "10px",
};

const input = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const submitBtn = {
  background: "#00c853",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
};

const grid = {
  display: "flex",
  gap: "20px",
  marginTop: "30px",
  flexWrap: "wrap",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  width: "200px",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const deleteBtn = {
  marginTop: "10px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Dashboard;