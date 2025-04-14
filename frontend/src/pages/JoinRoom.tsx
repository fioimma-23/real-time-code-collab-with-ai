import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, LogOut } from "lucide-react";
import { useApplyTheme } from "../hooks/useApplyTheme";
import { setRoomId } from "../redux/Slices/roomSlice";

const JoinRoom = () => {
  useApplyTheme();
  const [roomId, setRoomIdState] = useState(""); // Renamed to avoid conflict
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoin = () => {
    if (roomId) {
      dispatch(setRoomId(roomId)); 
      navigate(`/editor/${roomId}`);
    } else {
      alert("Please enter Room ID.");
    }
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setRoomIdState(id); // Updated to use the renamed function
  };

  const handleLogout = () => {
    localStorage.clear(); // or remove specific auth item like localStorage.removeItem("token")
    navigate("/"); // Redirect to homepage or login
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-[var(--text)] relative">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-neonGreen transition">Home</Link>
          <Link to="/about" className="hover:text-neonGreen transition">About</Link>
          <Link to="/help" className="hover:text-neonGreen transition">Help</Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-[var(--text)] hover:text-neonGreen transition"
          >
            <User className="w-6 h-6" />
          </button>

          {/* Dropdown Box */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-[var(--bg)] border border-neonGreen rounded-md shadow-lg z-10">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-neonGreen hover:text-black transition"
                onClick={() => setShowDropdown(false)}
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-neonGreen hover:text-black transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Join Room Section */}
      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <div className="flex items-center gap-4 mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-4xl font-bold tracking-wide text-neonGreen">D_CODE</h1>
        </div>

        <div className="bg-[var(--bg)] border border-neonGreen p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text)]">Join Room</h2>

          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomIdState(e.target.value)} // Updated to use the renamed function
            className="w-full bg-transparent border border-neonGreen text-neonGreen px-4 py-2 rounded mb-4 focus:outline-none"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-neonGreen text-black font-bold py-2 rounded hover:bg-green-400 transition"
          >
            Join
          </button>

          <p className="text-center text-sm mt-4 text-[var(--text)]">
            Don’t have a Room ID?{" "}
            <span
              onClick={generateRoomId}
              className="text-neonGreen underline cursor-pointer hover:text-white"
            >
              Generate
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
