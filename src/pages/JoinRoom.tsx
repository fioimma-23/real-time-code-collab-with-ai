import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId && username) {
      navigate(`/editor/${roomId}`, { state: { username } });
    } else {
      alert("Please enter Room ID and Username.");
    }
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setRoomId(id);
  };

  return (
    <div className="min-h-screen bg-black text-neonGreen font-mono relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-neonGreen relative">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/help" className="hover:text-white transition">Help</Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-neonGreen hover:text-white transition"
          >
            <User className="w-6 h-6" />
          </button>

          {/* Dropdown Box */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-black border border-neonGreen rounded-md shadow-lg z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-neonGreen hover:text-black transition"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <Link
                to="/history"
                className="block px-4 py-2 hover:bg-neonGreen hover:text-black transition"
                onClick={() => setShowDropdown(false)}
              >
                History
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Join Room Section */}
      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <div className="flex items-center gap-4 mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-4xl font-bold tracking-wide">D_CODE</h1>
        </div>

        <div className="bg-black border border-neonGreen p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Join Room</h2>

          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-black border border-neonGreen text-neonGreen px-4 py-2 rounded mb-4 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-black border border-neonGreen text-neonGreen px-4 py-2 rounded mb-6 focus:outline-none"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-neonGreen text-black font-bold py-2 rounded hover:bg-green-400 transition"
          >
            Join
          </button>

          <p className="text-center text-sm mt-4">
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
