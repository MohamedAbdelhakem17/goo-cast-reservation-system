import "@fortawesome/fontawesome-free/css/all.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../i18n/config.js";
import App from "./App.jsx";
import "./config/vite-google-tag-manager.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
