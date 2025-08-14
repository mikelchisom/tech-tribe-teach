import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ fontWeight: "bold" }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.75rem", fontWeight: "bold" }}>
          Login
        </button>
      </form>
    </div>
  );
}