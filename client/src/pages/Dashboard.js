import React, { useEffect, useState } from "react";
import { getQueues, joinQueue, createQueue } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [queues, setQueues] = useState([]);
  const [myQueue, setMyQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const fetchQueues = async () => {
    try {
      const res = await getQueues();
      console.log("Fetched Queues:", res.data);
      setQueues(res.data.reverse());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();

    const interval = setInterval(fetchQueues, 5000); // live update
    return () => clearInterval(interval);
  }, []);

  // 🔹 Join queue
  const handleJoin = async (queue) => {
    try {
      const res = await joinQueue(queue._id);

      setMyQueue({
        ...queue,
        waitTime: res.data.waitTime
      });

      alert("Joined queue!");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Create queue
  const handleCreate = async () => {
    try {
      await createQueue({
        name: "Test Queue",
        maxCapacity: 50,
        serviceRate: 2
      });

      alert("Queue Created");

      await fetchQueues(); // refresh UI
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  console.log("STATE QUEUES:", queues);

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

        {/* 🔥 CREATE BUTTON */}
        <button onClick={handleCreate}>
          Create Test Queue
        </button>

        {/* 👤 MY QUEUE */}
        {myQueue && (
          <div style={myQueueCard}>
            <h2>My Queue</h2>
            <p>{myQueue.name}</p>
            <p>Estimated Wait Time: {myQueue.waitTime} mins</p>
          </div>
        )}

        {/* 📊 ALL QUEUES */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={grid}>
            {queues.map((q) => (
              <div
                key={q._id}
                style={card}
                onClick={() => navigate(`/queue/${q._id}`)}
              >
                <h3>{q.name}</h3>

                {/* ✅ FIXED FIELDS */}
                <p>People in Queue: {q.currentLength}</p>
                <p>Wait Time: {q.waitTime} mins</p>

                {/* 🔹 JOIN BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    handleJoin(q);
                  }}
                >
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


// 🎨 Styles

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
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  cursor: "pointer"
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