// import React, { useContext } from "react";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useApplyTheme } from "../hooks/useApplyTheme";

import { useNavigate, Link } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  useApplyTheme();


  return (
    <div className="min-h-screen font-mono flex flex-col">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-neonGreen">
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/help" className="hover:text-white transition">Help</Link>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="theme" className="text-neonGreen font-semibold">Theme:</label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="bg-neonGreen text-black font-semibold px-3 py-1 rounded"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="mono">Monochrome</option>
            <option value="github">GitHub</option>
            {/* <option value="githubDark">GitHub Dark</option> */}
          </select>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-3" />
          <h1 className="text-5xl font-extrabold tracking-widest text-neonGreen">D_CODE</h1>
        </div>

        <p className="text-xl font-light mb-6">
          Real-Time Collaborative Coding —<br />
          <span className="text-neonGreen font-semibold">Code. Sync. Ship.</span>
        </p>

        <button
          onClick={() => navigate("/signin")}
          className="bg-neonGreen text-black px-6 py-3 rounded-full font-bold hover:bg-green-400 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
