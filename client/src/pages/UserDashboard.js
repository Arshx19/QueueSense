import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [queues, setQueues] = useState([]);
  const [joinedQueues, setJoinedQueues] = useState([]);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  // 🔥 GET USER + UNIQUE KEY
  const getUserKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `joinedQueues_${user._id}` : "joinedQueues";
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "user") {
      navigate("/");
      return;
    }

    const rawUser = localStorage.getItem("user");

    let user = null;
    try {
      user = JSON.parse(rawUser);
    } catch {}

    if (user && user.name && user.name.trim() !== "") {
      setUserName(user.name);
    } else {
      setUserName("User");
    }

    // 🔥 FIXED STORAGE
    const key = getUserKey();
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setJoinedQueues(stored);

  }, [navigate]);

  const fetchQueues = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queue");
      setQueues(res.data);
    } catch (err) {
      setQueues([]);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  // ✅ JOIN
  const joinQueue = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(
        `http://localhost:5000/api/queue/${id}/join`,
        {
          userId: user._id
        }
      );

      if (!joinedQueues.includes(id)) {
        const updated = [...joinedQueues, id];
        setJoinedQueues(updated);

        const key = getUserKey();
        localStorage.setItem(key, JSON.stringify(updated));
      }

      fetchQueues();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ✅ LEAVE
  const leaveQueue = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(
        `http://localhost:5000/api/queue/${id}/leave`,
        {
          userId: user._id
        }
      );

      const updated = joinedQueues.filter((q) => q !== id);
      setJoinedQueues(updated);

      const key = getUserKey();
      localStorage.setItem(key, JSON.stringify(updated));

      fetchQueues();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={container}>
      <div style={sidebar}>
        <h2 style={logo}>QueueSense</h2>

        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          👋 Hi, {userName}
        </p>

        <p style={sideItem}>User Dashboard</p>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={main}>
        <h1>User Dashboard</h1>

        <div style={grid}>
          {queues.length === 0 ? (
            <p>No queues available</p>
          ) : (
            queues.map((q) => (
              <div key={q._id} style={card}>
                <h3>{q.name}</h3>

                <p style={orgText}>{q.organization || "General"}</p>

                <p>People: {q.currentLength}</p>
                <p>Wait: {q.waitTime || 0} mins</p>

                {joinedQueues.includes(q._id) ? (
                  <>
                    <p style={joinedText}>Joined</p>

                    <button
                      style={{ ...joinBtn, background: "#16a34a" }}
                      onClick={() => navigate(`/display/${q._id}`)}
                    >
                      View Queue
                    </button>

                    <button
                      style={{ ...joinBtn, background: "#ef4444" }}
                      onClick={() => leaveQueue(q._id)}
                    >
                      Leave Queue
                    </button>
                  </>
                ) : (
                  <button
                    style={joinBtn}
                    onClick={() => joinQueue(q._id)}
                  >
                    Join Queue
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const container = {
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ece6ff, #ffd9ea)"
};

const sidebar = {
  width: "220px",
  padding: "20px",
  background: "#fff",
  boxShadow: "0 0 20px rgba(0,0,0,0.05)"
};

const logo = {
  color: "#6c63ff",
  marginBottom: "20px"
};

const sideItem = {
  marginBottom: "12px"
};

const logoutBtn = {
  marginTop: "20px",
  padding: "10px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const main = {
  flex: 1,
  padding: "30px"
};

const grid = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  width: "220px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
};

const orgText = {
  color: "#6c63ff",
  fontWeight: "bold",
  marginBottom: "5px"
};

const joinBtn = {
  marginTop: "10px",
  background: "#6c63ff",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
};

const joinedText = {
  color: "#16a34a",
  fontWeight: "bold",
  marginTop: "5px"
};

export default UserDashboard;