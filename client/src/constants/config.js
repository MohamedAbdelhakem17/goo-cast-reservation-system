// Automatically select API URL based on environment
const getApiBaseUrl = () => {
  // Check if VITE_API_BASE_URL is set in .env file
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback: auto-detect based on current hostname
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:8045/api";
  } else if (hostname.includes("staging")) {
    return "https://staging.goocast.net/api";
  } else {
    return "https://booking.goocast.net/api";
  }
};

export const API_BASE_URL = getApiBaseUrl();

export const SYSTEM_ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});
