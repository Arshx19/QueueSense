import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function Settings() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    maxCapacity: "",
    serviceRate: "",
  });

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/queue/${id}`
        );

        setForm({
          name: res.data.name || "",
          maxCapacity: res.data.maxCapacity || "",
          serviceRate: res.data.serviceRate || "",
        });

      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      }
    };

    fetchQueue();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/queue/${id}`,
        {
          name: form.name,
          maxCapacity: Number(form.maxCapacity),
          serviceRate: Number(form.serviceRate),
        }
      );

      alert("Changes saved successfully");
      navigate(`/queue/${id}`);

    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert("Failed to update queue");
    }
  };

  return (
    <div style={bg}>
      <div style={card}>
        <h2 style={title}>Queue Settings</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Queue Name"
            style={input}
          />

          <input
            name="maxCapacity"
            value={form.maxCapacity}
            onChange={handleChange}
            placeholder="Max Capacity"
            style={input}
          />

          <input
            name="serviceRate"
            value={form.serviceRate}
            onChange={handleChange}
            placeholder="Service Rate"
            style={input}
          />

          <button type="submit" style={btn}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

/* STYLES */

const bg = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #ece6ff, #ffd9ea)",
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  width: "350px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
};

const title = {
  marginBottom: "20px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#6c63ff",
  color: "white",
  cursor: "pointer",
};

export default Settings;