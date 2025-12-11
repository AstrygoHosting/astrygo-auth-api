// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Domains from "./pages/Domains";
import Deployments from "./pages/Deployments";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import ProtectedRoute from "./routes/ProtectedRoute";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public route: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes: everything under App layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          {/* Nested routes rendered inside <Outlet /> in App.tsx */}
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="domains" element={<Domains />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
