import React from "react";
import { Link } from "react-router-dom";
import { useApplyTheme } from "../hooks/useApplyTheme";

const Profile = () => {
  useApplyTheme();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-[var(--text)]">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:opacity-80 transition">Home</Link>
          <Link to="/about" className="hover:opacity-80 transition">About</Link>
          <Link to="/help" className="hover:opacity-80 transition">Help</Link>
        </div>
        <Link to="/join" className="hover:opacity-80 transition">Back</Link>
      </nav>

      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <h1 className="text-4xl font-bold mb-6">Your Profile</h1>

        <div className="bg-[var(--bg)] border border-[var(--text)] p-8 rounded-2xl shadow-xl w-full max-w-md">
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
