import React from "react";

type Usage = { cpu: number; bandwidthMB: number; ts: number };

export default function Dashboard() {
  const [health, setHealth] = React.useState<string>("checking…");
  const [usage, setUsage] = React.useState<Usage | null>(null);

  React.useEffect(() => {
    fetch("http://localhost:8787/health")
      .then(r => r.json())
      .then(d => setHealth(`OK • ${new Date(d.ts).toLocaleTimeString()}`))
      .catch(() => setHealth("offline"));

    fetch("http://localhost:8787/usage")
      .then(r => r.json())
      .then(setUsage)
      .catch(() => setUsage(null));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Overview</h1>

      <div className="rounded-xl border p-4 bg-white">
        <div className="text-sm text-neutral-500 mb-2">API Health</div>
        <div className={`text-base font-medium ${health === "offline" ? "text-red-600" : "text-green-600"}`}>
          {health}
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white">
        <div className="text-sm text-neutral-500 mb-2">Usage</div>
        {usage ? (
          <div className="text-base">
            CPU: {usage.cpu}% • Bandwidth: {usage.bandwidthMB} MB
          </div>
        ) : (
          <div className="text-base text-neutral-500">loading…</div>
        )}
      </div>
    </div>
  );
}
