import React from "react";
import { useNavigate } from "react-router-dom";
import { useApplyTheme } from "../hooks/useApplyTheme";

const History = () => {
  useApplyTheme();
  const navigate = useNavigate();

  const previousFiles = [
    { name: "index.js", lastModified: "2025-04-10" },
    { name: "app.py", lastModified: "2025-04-09" },
  ];

  const rooms = [
    {
      id: "room1234",
      collaborators: ["Ananya", "Ajay"],
      date: "2025-04-08",
    },
    {
      id: "room5678",
      collaborators: ["Chaai"],
      date: "2025-04-06",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[var(--text)] border border-[var(--text)] px-4 py-2 rounded hover:bg-[var(--text)] hover:text-[var(--bg)] transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">📜 History</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Previous Files</h2>
        <ul className="space-y-2">
          {previousFiles.map((file, idx) => (
            <li
              key={idx}
              className="bg-[color:var(--card)] border border-neonGreen p-4 rounded"
            >
              <p className="font-bold">{file.name}</p>
              <p className="text-sm text-gray-400">
                Last Modified: {file.lastModified}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Previous Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room, idx) => (
            <li
              key={idx}
              className="bg-[color:var(--card)] border border-neonGreen p-4 rounded"
            >
              <p className="font-bold">Room ID: {room.id}</p>
              <p className="text-sm">
                Collaborators: {room.collaborators.join(", ")}
              </p>
              <p className="text-sm text-gray-400">Date: {room.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
