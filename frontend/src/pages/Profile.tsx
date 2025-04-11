import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="min-h-screen bg-black text-neonGreen font-mono">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-neonGreen">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/help" className="hover:text-white transition">Help</Link>
        </div>
        <Link to="/join" className="text-neonGreen hover:text-white transition">Back</Link>
      </nav>

      {/* Profile Content */}
      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <h1 className="text-4xl font-bold mb-6">Your Profile</h1>

        <div className="bg-black border border-neonGreen p-8 rounded-2xl shadow-xl w-full max-w-md">
          <p className="mb-4">👤 <span className="font-semibold">Username:</span> Fionna</p>
          <p className="mb-4">🆔 <span className="font-semibold">User ID:</span> fioimma</p>
          <p className="mb-4">📧 <span className="font-semibold">Email:</span> fioimma@gmail.com</p>
          <p className="mb-4">📅 <span className="font-semibold">Joined:</span> Jan 1, 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
