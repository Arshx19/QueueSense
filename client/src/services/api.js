import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const registerUser = (data) => API.post("/auth/register", data);

export const createQueue = (data) => API.post("/queues", data);
export const updateQueue = (id, data) => API.put(`/queues/${id}`, data);
export const getQueue = (id) => API.get(`/queues/${id}`);