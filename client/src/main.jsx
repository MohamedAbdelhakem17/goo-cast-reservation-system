import "@fortawesome/fontawesome-free/css/all.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../i18n/config.js";
import App from "./App.jsx";
import "./index.css";
// Dynamically import Google Tag Manager based on environment
if (import.meta.env.VITE_ENV === "production") {
  import("./config/vite-google-tag-manager.js");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
