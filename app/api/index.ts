import axios from "axios";

//const API_BASE_URL = "https://childgrowthtrackingsystembe-production.up.railway.app/api/v1";
const API_BASE_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;