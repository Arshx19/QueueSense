import { useState } from "react";
import queueImage from "../assets/line.png";

function Landing() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={main}>

      {/* Navbar */}
      <div style={nav}>
        <h2 style={{ color: "#6c63ff" }}>QueueSense</h2>
        <div>
          <button style={navBtn} onClick={() => setIsLogin(true)}>Sign In</button>
          <button style={{ ...navBtn, marginLeft: "10px" }} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
      </div>

      {/* Main Section */}
      <div style={container}>

        {/* LEFT SIDE */}
        <div style={left}>
          <h1 style={title}>You're now in a virtual queue</h1>
          <p style={subtitle}>
            Skip the line. Join queues online and track your turn in real-time.
          </p>
          <img
            src={queueImage}
            alt="queue illustration"
            style={{
                width: "400px",
                marginTop: "30px",
                mixBlendMode: "multiply"
            }}
/>
        </div>

        {/* RIGHT SIDE */}
        <div style={card}>
          <h2>{isLogin ? "Welcome" : "Create Account"}</h2>

          {!isLogin && <input style={input} placeholder="Full Name" />}

          <input style={input} placeholder="Email Address" />
          <input style={input} type="password" placeholder="Password" />

          <button style={mainBtn}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p style={{ marginTop: "10px" }}>
            {isLogin ? "New here?" : "Already have an account?"}
            <span
              style={link}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? " Sign Up" : " Sign In"}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
const main = {
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 25% 35%, #e8dcf5 0%, transparent 40%),
    radial-gradient(circle at 75% 65%, #f5d7dd 0%, transparent 40%),
    linear-gradient(135deg, #f4effa, #f8f5fc)
  `,
  fontFamily: "Segoe UI"
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 40px",
  background: "white",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const navBtn = {
  padding: "8px 16px",
  border: "none",
  background: "#6c63ff",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer"
};

const container = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "50px"
};

const left = {
  maxWidth: "500px"
};

const title = {
  fontSize: "40px",
  color: "#333"
};

const subtitle = {
  color: "#666",
  marginTop: "10px"
};

const image = {
  width: "300px",
  marginTop: "30px"
};

const card = {
  width: "320px",
  padding: "25px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  backdropFilter: "blur(10px)",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const mainBtn = {
  padding: "12px",
  background: "#6c63ff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const link = {
  color: "#6c63ff",
  cursor: "pointer",
  fontWeight: "bold"
};

export default Landing;