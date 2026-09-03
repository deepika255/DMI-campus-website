import React, { useState } from "react";

function TeacherLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    onLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "35px",
          background: "#18181b",
          borderRadius: "18px",
          border: "1px solid #27272a",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          DMI CAMPUS
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#a1a1aa",
            marginBottom: "30px",
          }}
        >
          Teacher Login
        </p>

        <form onSubmit={handleLogin}>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              marginBottom: "20px",
              boxSizing: "border-box",
              borderRadius: "10px",
              border: "1px solid #3f3f46",
              background: "#09090b",
              color: "white",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              marginBottom: "25px",
              boxSizing: "border-box",
              borderRadius: "10px",
              border: "1px solid #3f3f46",
              background: "#09090b",
              color: "white",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherLogin;