import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Domains from "./pages/Domains";
import Deployments from "./pages/Deployments";
import Billing from "./pages/Billing";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Protected from "./components/Protected";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <Protected>
        <App />
      </Protected>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "services", element: <Services /> },
      { path: "domains", element: <Domains /> },
      { path: "deployments", element: <Deployments /> },
      { path: "billing", element: <Billing /> },
      { path: "support", element: <Support /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
