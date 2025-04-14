import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios"; // Import axios
import { useApplyTheme } from "../hooks/useApplyTheme";
import { setAuthField } from "../redux/Slices/authSlice";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // To handle form errors
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useApplyTheme();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const payload = {
      username,
      password,
    }
    try {
      const response = await axios.post("http://localhost:5000/auth/login",
        payload,
      );
      console.log(response.data);
      if (response.status === 201 || response.status === 200) {
        dispatch(setAuthField({ field: "username", value: username }));
        dispatch(setAuthField({ field: "password", value: password }));
        navigate("/home");
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("User not found");
      } else if (err.response?.status === 401) {
        setError("Incorrect password");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center font-mono px-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">Sign In</h1>

      <div className="bg-[var(--bg)] border border-[var(--text)] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-4 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-[var(--text)] text-[var(--text)] px-4 py-2 rounded mb-6 focus:outline-none"
        />

        <button
          onClick={handleSignIn}
          className="w-full bg-neonGreen text-black font-bold py-2 rounded hover:bg-green-400 transition"
        >
          Sign In
        </button>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <span
            className="text-[var(--text)] underline cursor-pointer hover:opacity-80"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
