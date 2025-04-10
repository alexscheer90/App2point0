import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Starting Mobile #MACtion app render");

try {
  // Use standard routing for simplicity
  const rootElement = document.getElementById("root");
  console.log("Root element:", rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log("Created root, rendering App");
    root.render(<App />);
    console.log("App rendered successfully");
  } else {
    console.error("Root element not found!");
  }
} catch (error) {
  console.error("Error rendering app:", error);
}
