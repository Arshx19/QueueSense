// import axios from "axios";
// const API = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// export const registerUser = (data) => API.post("/auth/register", data);
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// export default API;

// export const registerUser = (data) => API.post("/auth/register", data);

// export const loginUser = (data) => API.post("/auth/login", data);

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// // AUTH
// export const registerUser = (data) => API.post("/auth/register", data);
// export const loginUser = (data) => API.post("/auth/login", data);

// // QUEUE
// export const getQueues = () => API.get("/queue");
// export const joinQueue = (id) => API.post(`/queue/join/${id}`);

// export default API;

// ------------------------------------------
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔐 Attach token automatically (future ready)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});


// ================= AUTH =================

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);


// ================= QUEUE =================

// Get all queues
export const getQueues = () =>
  API.get("/queue");

// Join queue ✅ FIXED
export const joinQueue = (id) =>
  API.post(`/queue/${id}/join`);

// Leave queue (optional)
export const leaveQueue = (id) =>
  API.post(`/queue/${id}/leave`);

// Create queue (future admin)
export const createQueue = (data) =>
  API.post("/queue/create", data);

export default API;