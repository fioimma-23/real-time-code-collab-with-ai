import React from "react";

const Help = () => {
  return (
    <div className="min-h-screen bg-black text-neonGreen font-mono p-8">
      <h1 className="text-4xl font-bold mb-4">Help</h1>
      <p className="text-lg">
        Welcome to the Help section of D_CODE! 🚀
      </p>
      <ul className="mt-6 list-disc list-inside space-y-2">
        <li>🔐 To join a room, enter the Room ID and your Username.</li>
        <li>🎲 If you don’t have a Room ID, click "Generate".</li>
        <li>🧑‍💻 Use the real-time editor to collaborate live with others.</li>
        <li>💡 Refreshing may reset the session unless you rejoin with the same Room ID.</li>
      </ul>
    </div>
  );
};

export default Help;
