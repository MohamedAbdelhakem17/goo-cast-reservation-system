import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/index.css";
import App from "./app/App.jsx";
import TagManager from "react-gtm-module";

// // Initialize GTM with your GTM ID
// const tagManagerArgs = {
//   gtmId: "GTM-P92D4BCV",
// };

// TagManager.initialize(tagManagerArgs);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
