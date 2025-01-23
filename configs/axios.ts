import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sh-gateway-api-818425675835.us-central1.run.app",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
