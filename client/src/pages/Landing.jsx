import { useState } from "react";
import { useNavigate } from "react-router-dom";
import queueImage from "../assets/line.png";
import { registerUser, loginUser } from "../services/api";


function Landing() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("CLICKED", form);

    try {
      const res = isLogin
        ? await loginUser(form)
        : await registerUser(form);

      console.log("SUCCESS:", res.data);

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful");
        navigate("/dashboard");
      } else {
        alert("Registered successfully");
      }

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div style={main}>
      <div style={nav}>
        <h2 style={{ color: "#6c63ff" }}>QueueSense</h2>
        <div>
          <button style={navBtn} onClick={() => setIsLogin(true)}>
            Sign In
          </button>
          <button
            style={{ ...navBtn, marginLeft: "10px" }}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div style={container}>
        <div style={left}>
          <h1 style={title}>You're now in a virtual queue</h1>
          <p style={subtitle}>
            Skip the line. Join queues online and track your turn in real-time.
          </p>
          <img
            src={queueImage}
            alt="queue"
            style={{
              width: "400px",
              marginTop: "30px",
              mixBlendMode: "multiply"
            }}
          />
        </div>

        <form style={card} onSubmit={handleSubmit}>
          <h2>{isLogin ? "Welcome" : "Create Account"}</h2>

          {!isLogin && (
            <input
              style={input}
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          )}

          <input
            style={input}
            placeholder="Email Address"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#6c63ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#574fd6")}
            onMouseLeave={(e) => (e.target.style.background = "#6c63ff")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
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
        </form>
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

const link = {
  color: "#6c63ff",
  cursor: "pointer",
  fontWeight: "bold"
};

export default Landing;