import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Admin from "./pages/Admin";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"

// Los enlaces de invitación / recuperación de Netlify Identity llegan a "/" con un token en el hash
if (window.location.pathname === "/" && /_token=/.test(window.location.hash)) {
  window.history.replaceState(null, "", "/admin" + window.location.hash);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
