import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Get the root container element
const container = document.getElementById("root");

// Check if the root container exists
if (!container) {
  throw new Error("Root container not found. Ensure you have a <div id='root'></div> in your index.html file.");
}

// Create a root for the app
const root = createRoot(container);

// Render the app
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// Debugging: Log a message to confirm the app is rendering
console.log("App rendered successfully!");