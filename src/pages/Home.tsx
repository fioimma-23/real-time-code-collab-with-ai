import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-neonGreen font-mono flex flex-col">
    
      <nav className="flex justify-between items-center px-6 py-4 border-b border-neonGreen">
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/about" className="hover:text-white transition">About</Link>
        <Link to="/help" className="hover:text-white transition">Help</Link>
      </div>
      <button
          onClick={() => navigate("/signin")}
          className="bg-neonGreen text-black px-4 py-2 rounded font-semibold hover:bg-green-400 transition"
        >
          Sign In
        </button>
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
