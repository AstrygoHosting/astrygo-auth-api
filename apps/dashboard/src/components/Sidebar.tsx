import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Server, Globe, Rocket, CreditCard, LifeBuoy, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Overview", icon: <LayoutGrid className="w-4 h-4" />, end: true },
  { to: "/services", label: "Services", icon: <Server className="w-4 h-4" /> },
  { to: "/domains", label: "Domains", icon: <Globe className="w-4 h-4" /> },
  { to: "/deployments", label: "Deployments", icon: <Rocket className="w-4 h-4" /> },
  { to: "/billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  { to: "/support", label: "Support", icon: <LifeBuoy className="w-4 h-4" /> },
  { to: "/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 border-r bg-white">
      <div className="w-full p-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-black text-white grid place-items-center shadow">
            <span className="font-bold">AG</span>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Astrygo Cloud</p>
            <h2 className="text-sm font-semibold">Client Dashboard</h2>
          </div>
        </div>
        <nav className="space-y-1">
          {items.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition
                 ${isActive ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"}`
              }
            >
              {icon} <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
