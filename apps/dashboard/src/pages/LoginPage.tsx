// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { login } from "../services/authService";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await login({ email, password });

      if (!result.ok) {
        setError(result.message || "Login failed");
        return;
      }

      // TODO: handle token / user context
      setSuccessMessage(`Logged in as ${result.email}`);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.body?.error ||
          err?.body?.message ||
          "Unexpected error while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Astrygo Dashboard Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {error && (
        <div style={{ color: "red", marginTop: 12 }}>
          {error}
        </div>
      )}
      {successMessage && (
        <div style={{ color: "green", marginTop: 12 }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
