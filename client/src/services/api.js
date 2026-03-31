import axios from "axios";

export const registerUser = (data) => {
  return axios.post(
    "http://localhost:5000/api/auth/register",
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};
export const loginUser = (data) => {
  return axios.post(
    "http://localhost:5000/api/auth/login",
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};