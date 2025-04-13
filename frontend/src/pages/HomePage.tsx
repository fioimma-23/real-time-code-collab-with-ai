import React, { useState, useRef, useEffect } from "react";
import { Folder, PlusCircle, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import dispatch
import { setProjectName } from "../redux/Slices/projectSlice"; // Import the action
import { useApplyTheme } from "../hooks/useApplyTheme";

const HomePage = () => {
  useApplyTheme();
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("none");
  const [projectName, setProjectNameState] = useState("");  // No need for projectId now
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const previousFiles = [
    { name: "index.js", lastModified: "2025-04-10" },
    { name: "app.py", lastModified: "2025-04-09" },
  ];

  const rooms = [
    {
      projectName: "React Dashboard",
      collaborators: ["Ananya", "Ajay"],
      date: "2025-04-08",
    },
    {
      projectName: "Python ML Bot",
      collaborators: ["Chaai"],
      date: "2025-04-06",
    },
  ];

  const handleJoinRoom = () => {
    // Dispatch the action when joining the room
    dispatch(setProjectName(projectName || ""));  // Save project name to Redux store
    navigate(`/join`);
  };

  const handleFileClick = (fileName: string) => {
    // Dispatch the action when opening a file
    dispatch(setProjectName(fileName));  // Save file name to Redux store
    navigate(`/editor`, { state: { fileName } });
  };

  const handleRoomClick = (room: typeof rooms[0]) => {
    // Dispatch the action when selecting a room
    dispatch(setProjectName(room.projectName));  // Save room's project name to Redux store
    navigate(`/editor`, { state: { fileName: room.projectName } });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-[var(--text)] relative">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-neonGreen transition">Home</Link>
          <Link to="/about" className="hover:text-neonGreen transition">About</Link>
          <Link to="/help" className="hover:text-neonGreen transition">Help</Link>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="text-[var(--text)] hover:text-neonGreen transition"
          >
            <User className="w-6 h-6" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-[var(--bg)] border border-neonGreen rounded-md shadow-lg z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-neonGreen hover:text-black transition"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 border-r border-[var(--text)] p-6 space-y-10 h-[calc(100vh-64px)] flex flex-col">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold tracking-wide">D_CODE</h1>
          </div>

          <nav className="flex flex-col gap-4 text-lg">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-[var(--text)] hover:text-black transition ${
                activeTab === "new" ? "bg-[var(--text)] text-black" : ""
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              New Project
            </button>
            <button
              onClick={() => setActiveTab("existing")}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-[var(--text)] hover:text-black transition ${
                activeTab === "existing" ? "bg-[var(--text)] text-black" : ""
              }`}
            >
              <Folder className="w-5 h-5" />
              Existing Projects
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-auto">
          {activeTab === "none" && (
            <div className="text-center mt-20 text-xl">
              <h2 className="text-3xl font-bold mb-4">Welcome to D_CODE</h2>
              <p className="text-[var(--text)]/80">
                Select an option from the left to get started. You can create a new project or continue working on existing ones.
              </p>
            </div>
          )}

          {activeTab === "new" && (
            <div className="max-w-xl mx-auto mt-20">
              <h2 className="text-3xl font-bold mb-6">Start a New Project</h2>
              <label className="block mb-2 text-sm text-[var(--text)]/80">Project Name (optional):</label>
              <input
                type="text"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => {
                  setProjectNameState(e.target.value);  // Update local state
                  dispatch(setProjectName(e.target.value));  // Dispatch the action to Redux store
                }}
                className="w-full px-4 py-2 bg-transparent border border-[var(--text)] rounded text-[var(--text)] mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--text)]"
              />
              <button
                onClick={handleJoinRoom}
                className="w-full bg-[var(--text)] text-black font-bold py-2 rounded hover:bg-green-400 transition"
              >
                Join Room
              </button>
            </div>
          )}

          {activeTab === "existing" && (
            <div className="mt-10 space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-4">File History</h2>
                <ul className="space-y-2 text-[var(--text)]/90">
                  {previousFiles.map((file, idx) => {
                    return (
                      <li
                        key={idx}
                        className="border border-[var(--text)] rounded px-4 py-2 hover:bg-[var(--text)] hover:text-black transition cursor-pointer"
                        onClick={() => handleFileClick(file.name)}
                      >
                        {file.name} — Last Modified: {file.lastModified}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Room History</h2>
                <ul className="space-y-2 text-[var(--text)]/90">
                  {rooms.map((room, idx) => (
                    <li
                      key={idx}
                      className="border border-[var(--text)] rounded px-4 py-2 hover:bg-[var(--text)] hover:text-black transition cursor-pointer"
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="font-semibold">{room.projectName}</div>
                      <div>Collaborators: {room.collaborators.join(", ")}</div>
                      <div>Date: {room.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
