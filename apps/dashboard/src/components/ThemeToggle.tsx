import React from "react";

export default function ThemeToggle() {
  const [dark, setDark] = React.useState<boolean>(() => {
    const stored = localStorage.getItem("astrygo-theme");
    if (stored) return stored === "dark";
    // prefer system
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("astrygo-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("astrygo-theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(v => !v)}
      className="rounded-xl border dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
      title="Toggle theme"
    >
      {dark ? "☾ Dark" : "☀︎ Light"}
    </button>
  );
}
