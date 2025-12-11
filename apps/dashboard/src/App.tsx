import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-black text-white grid place-items-center shadow">AG</div>
              <h1 className="text-lg font-semibold">Astrygo Dashboard</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full px-4 py-6">
          <Outlet />
        </main>

        <footer className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} Astrygo.com — Managed Cloud Hosting.
        </footer>
      </div>
    </div>
  );
}
