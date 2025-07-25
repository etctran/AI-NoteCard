import axios from "axios";

// Use a relative path for the API to work in both development and production
const api = axios.create({
  baseURL: "/api",
});

export default api;
