import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { InventoryProvider } from "./context/InventoryContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
          <InventoryProvider>
      <App />
    </InventoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);

