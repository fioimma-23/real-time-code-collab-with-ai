import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useApplyTheme } from "../hooks/useApplyTheme";
import { setAuthField } from "../redux/Slices/authSlice";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useApplyTheme();

  const handleSignUp = async () => {
    if (!username || !displayName || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      username,
      display_name: displayName,
      password,
      email,
    };

    try {
      const response = await axios.post("http://localhost:5000/auth/register", payload); // replace URL

      if (response.status === 201 || response.status === 200) {
        // Optionally dispatch
        dispatch(setAuthField({ field: "username", value: username }));
        dispatch(setAuthField({ field: "displayName", value: displayName }));
        dispatch(setAuthField({ field: "password", value: password }));
        navigate("/home");
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Registration failed");
      } else {
        alert("An unexpected error occurred");
      }
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
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-4 focus:outline-none"
        />
          <input
          type="email"
          placeholder="email"
          value={email}
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
