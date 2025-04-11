import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (username && email && password) {
        navigate("/join");
      }else {
      alert("Please fill in all fields.");
      }
   };

  return (
    <div className="min-h-screen bg-black text-neonGreen flex flex-col items-center justify-center font-mono px-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">Sign Up</h1>

      <div className="bg-black border border-neonGreen p-8 rounded-2xl shadow-xl w-full max-w-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-black border border-neonGreen text-neonGreen px-4 py-2 rounded mb-4 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-neonGreen text-neonGreen px-4 py-2 rounded mb-4 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black border border-neonGreen text-neonGreen px-4 py-2 rounded mb-6 focus:outline-none"
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
            className="text-neonGreen underline cursor-pointer hover:text-white"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
