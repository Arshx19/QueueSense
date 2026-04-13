import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);

// QUEUE CRUD

// ✅ CREATE
export const createQueue = (data) => 
  API.post("/queue/create", data);

// ✅ GET ALL
export const getQueues = () => 
  API.get("/queue");

// ✅ GET SINGLE
export const getQueue = (id) => 
  API.get(`/queue/${id}`);

// ✅ JOIN
export const joinQueue = (id) => 
  API.post(`/queue/${id}/join`);

// ✅ UPDATE
export const updateQueue = (id, data) => 
  API.put(`/queue/${id}`, data);

export default API;