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
  baseURL: "http://localhost:5000/api",
});

export const registerUser = (data) => API.post("/auth/register", data);