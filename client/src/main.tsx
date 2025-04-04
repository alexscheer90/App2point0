import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Use standard routing for simplicity
createRoot(document.getElementById("root")!).render(
  <App />
);
