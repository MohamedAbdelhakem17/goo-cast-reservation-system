import { API_BASE_URL } from "@/constants/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosInstanceV2 = axios.create({
  baseURL: `${API_BASE_URL}/v2`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

export { axiosInstanceV2 };
