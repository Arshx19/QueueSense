import { useState } from "react";
import queueImage from "../assets/line.png";
import { registerUser, loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    organization: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isLogin) {
        res = await loginUser({
          email: form.email,
          password: form.password
        });

        const user = res.data.user;

        if (!user || !user._id) {
          alert("User ID missing");
          return;
        }

        localStorage.setItem("userId", user._id);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);

        // 🔥 FIXED HERE
        localStorage.setItem("organization", user.organization);

        if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/user-dashboard");
        }

      } else {
        if (
          form.role === "admin" &&
          (!form.organization || form.organization.trim() === "")
        ) {
          alert("Organization is required for admin");
          return;
        }

        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role || "user",
          organization:
            form.role === "admin" ? form.organization : undefined
        };

        res = await registerUser(payload);

        alert("Registered successfully! Please log in.");
        setIsLogin(true);
      }

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div style={main}>
      <div style={nav}>
        <h2 style={{ color: "#6c63ff" }}>QueueSense</h2>
        <div>
          <button style={navBtn} onClick={() => setIsLogin(true)}>Sign In</button>
          <button style={{ ...navBtn, marginLeft: "10px" }} onClick={() => setIsLogin(false)}>Sign Up</button>
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
            style={{ width: "400px", marginTop: "30px", mixBlendMode: "multiply" }}
          />
        </div>

        <form style={card} onSubmit={handleSubmit}>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

          {!isLogin && (
            <input
              style={input}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          )}

          {!isLogin && (
            <select
              style={input}
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          {!isLogin && form.role === "admin" && (
            <input
              style={input}
              placeholder="Organization Name"
              value={form.organization}
              onChange={(e) =>
                setForm({ ...form, organization: e.target.value })
              }
            />
          )}

          <input
            style={input}
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit" style={mainBtn}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p style={{ marginTop: "10px" }}>
            {isLogin ? "New here?" : "Already have an account?"}
            <span style={link} onClick={() => setIsLogin(!isLogin)}>
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
  fontFamily: "Poppins, sans-serif"
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

const left = { maxWidth: "500px" };

const title = { fontSize: "40px", color: "#333" };

const subtitle = { color: "#666", marginTop: "10px" };

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