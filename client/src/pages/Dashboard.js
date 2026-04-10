import React, { useEffect, useState } from "react";
import { getQueues, joinQueue } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [queues, setQueues] = useState([]);
  const [myQueue, setMyQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQueues = async () => {
    try {
      const res = await getQueues();
      setQueues(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();

    const interval = setInterval(fetchQueues, 5000); // 🔄 live update
    return () => clearInterval(interval);
  }, []);

  const handleJoin = async (queue) => {
    try {
      const res = await joinQueue(queue._id);

      const token = res.data.token;

      setMyQueue({
        ...queue,
        token
      });

      alert("Joined queue!");
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={main}>

      {/* Sidebar */}
      <aside style={sidebar}>
        <h2>QueueSense</h2>
        <p>Dashboard</p>
        <p>Settings</p>
        <button onClick={logout}>Logout</button>
      </aside>

      {/* Main */}
      <div style={content}>

        <h1>Dashboard</h1>

        {/* 👤 MY QUEUE */}
        {myQueue && (
          <div style={myQueueCard}>
            <h2>My Queue</h2>
            <p>{myQueue.name}</p>
            <p>Your Token: {myQueue.token}</p>

            <p>
              People Ahead:{" "}
              {
                myQueue.users?.filter(u => u < myQueue.token).length
              }
            </p>

            <p>
              ETA:{" "}
              {
                (myQueue.users?.filter(u => u < myQueue.token).length || 0) *
                myQueue.avgTimePerUser
              } mins
            </p>
          </div>
        )}

        {/* 📊 ALL QUEUES */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={grid}>
            {queues.map((q) => (
              <div key={q._id} style={card}>
                <h3>{q.name}</h3>
                <p>Current Token: {q.currentToken}</p>
                <p>Total People: {q.users.length}</p>

                <button onClick={() => handleJoin(q)}>
                  Join Queue
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

const main = {
  display: "flex",
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 25% 35%, #e8dcf5 0%, transparent 40%),
    radial-gradient(circle at 75% 65%, #f5d7dd 0%, transparent 40%),
    linear-gradient(135deg, #f4effa, #f8f5fc)
  `,
  fontFamily: "Segoe UI"
};

const sidebar = {
  width: "220px",
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(10px)",
  padding: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
};

const content = {
  flex: 1,
  padding: "40px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px"
};

const card = {
  padding: "20px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};

const myQueueCard = {
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "12px",
  background: "#6c63ff",
  color: "white",
  boxShadow: "0 8px 20px rgba(108,99,255,0.3)"
};

export default Dashboard;


