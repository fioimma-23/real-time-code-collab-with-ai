import React from "react";
import { useApplyTheme } from "../hooks/useApplyTheme";

const Help = () => {
  useApplyTheme();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono p-8">
      <h1 className="text-4xl font-bold mb-6 border-b border-[var(--text)] pb-2">
        🆘 Help Center
      </h1>
      <p className="text-lg mb-4">
        Welcome to the help section of <span className="text-neonGreen font-bold">D_CODE</span>! 🚀 Whether you're coding solo or with your crew, we’ve got your back.
      </p>
      <ul className="mt-4 list-disc list-inside space-y-3">
        <li>🔐 <span className="text-white">Join a room</span> by entering a Room ID and your username.</li>
        <li>🎲 <span className="text-white">Don’t have a Room ID?</span> Hit “Generate” to create one instantly.</li>
        <li>🧑‍💻 <span className="text-white">Edit in real-time</span> with collaborators inside the live editor.</li>
        <li>💡 <span className="text-white">Refreshing resets the session</span>—rejoin with the same Room ID to get back in.</li>
      </ul>
    </div>
  );
};

export default Help;
