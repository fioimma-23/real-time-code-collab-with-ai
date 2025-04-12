import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplyTheme } from "../hooks/useApplyTheme";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [displayName, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useApplyTheme();

  const handleSignUp = () => {
    if (username && displayName && password && confirmPassword) {
      navigate("/home");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center font-mono px-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">Sign Up</h1>

      <div className="bg-[var(--bg)] border border-[var(--text)] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-4 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-4 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-6 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-6 focus:outline-none"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-neonGreen text-black font-bold py-2 rounded hover:bg-green-400 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-[var(--text)] underline cursor-pointer hover:opacity-80"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
