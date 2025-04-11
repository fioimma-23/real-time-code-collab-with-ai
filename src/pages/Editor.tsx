import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FilePlus,
  FolderPlus,
  Download,
  FileText,
  MessageCircle,
  Play,
  Users,
  Settings,
  Share2,
  X,
} from "lucide-react";

const Editor = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState(
    `function sayHi() {\n  console.log("Hello world");\n}\n\nsayHi();`
  );
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const [files, setFiles] = useState([{ name: "index.js", content: code }]);
  const [activeFile, setActiveFile] = useState("index.js");

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  const handleTabClose = (name: string) => {
    const updatedFiles = files.filter((f) => f.name !== name);
    setFiles(updatedFiles);
    if (name === activeFile && updatedFiles.length > 0) {
      setActiveFile(updatedFiles[0].name);
    }
  };

  const getActiveFileContent = () => {
    return files.find((f) => f.name === activeFile)?.content || "";
  };

  const updateActiveFileContent = (newContent: string) => {
    setFiles(
      files.map((f) =>
        f.name === activeFile ? { ...f, content: newContent } : f
      )
    );
    setCode(newContent);
  };

  return (
    <div className="h-screen flex text-white bg-[#0f1117]">
      {/* Sidebar */}
      <div className="w-14 bg-[#0b0d11] flex flex-col items-center py-4 space-y-6 border-r border-green-500">
        <div title="Files">
          <FileText className="text-green-400 w-5 h-5 hover:text-white" />
        </div>
        <div title="Chats" onClick={() => setShowChat(!showChat)}>
          <MessageCircle className="text-green-400 w-5 h-5 hover:text-white cursor-pointer" />
        </div>
        <div title="Run">
          <Play className="text-green-400 w-5 h-5 hover:text-white" />
        </div>
        <div title="Collaborators">
          <Users className="text-green-400 w-5 h-5 hover:text-white" />
        </div>
        <div title="Settings" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="text-green-400 w-5 h-5 hover:text-white cursor-pointer" />
        </div>
        <div title="Share">
          <Share2 className="text-green-400 w-5 h-5 hover:text-white" />
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col border border-green-500 rounded-md m-4 overflow-hidden">
        {/* Room ID Header */}
        <div className="bg-[#0f1117] text-green-400 font-bold p-2 text-sm border-b border-green-500">
          Room: {roomId}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Files Panel */}
          <div className="w-64 bg-[#0f1117] border-r border-green-500 p-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-green-400">Files</p>
                <div className="flex space-x-2">
                  <div title="New File">
                    <FilePlus className="w-4 h-4 cursor-pointer text-green-400 hover:text-white" />
                  </div>
                  <div title="New Folder">
                    <FolderPlus className="w-4 h-4 cursor-pointer text-green-400 hover:text-white" />
                  </div>
                  <div title="Download Code">
                    <Download className="w-4 h-4 cursor-pointer text-green-400 hover:text-white" />
                  </div>
                </div>
              </div>

              {files.map((file) => (
                <p
                  key={file.name}
                  className="text-yellow-400 text-sm cursor-pointer"
                  onClick={() => setActiveFile(file.name)}
                >
                  {file.name}
                </p>
              ))}
            </div>

            {/* Open File/Folder Button at Bottom */}
            <div className="flex items-center gap-2 bg-[#1e1e2f] hover:bg-[#2a2e3f] cursor-pointer text-white p-2 rounded mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                viewBox="0 0 24 24"
                className="text-white"
              >
                <path d="M13 17v-6h3l-4-5-4 5h3v6h2zm8-9h-9l-2-2H3c-1.104 0-2 .896-2 2v10c0 1.104.896 2 2 2h18c1.104 0 2-.896 2-2V10c0-1.104-.896-2-2-2z" />
              </svg>
              <span className="text-sm">Open File/Folder</span>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-[#0f1117] p-4 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex bg-[#1e1e2f] rounded-t">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
                    file.name === activeFile
                      ? "bg-[#0b0d11] text-yellow-400"
                      : "text-green-400"
                  }`}
                  onClick={() => setActiveFile(file.name)}
                >
                  {file.name}
                  <X
                    size={14}
                    className="ml-2 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClose(file.name);
                    }}
                  />
                </div>
              ))}
            </div>

            <textarea
              value={getActiveFileContent()}
              onChange={(e) => updateActiveFileContent(e.target.value)}
              className="w-full flex-1 bg-[#0f1117] text-green-400 p-4 font-mono outline-none resize-none"
            />
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 bg-[#10141f] border-l border-green-500 flex flex-col">
              <div className="p-2 border-b border-green-500 text-green-400 font-bold flex items-center justify-between">
                <span>💬 Chat</span>
                <X
                  size={16}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => setShowChat(false)}
                />
              </div>
              <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="text-sm bg-[#1e1e2f] p-2 rounded text-white"
                  >
                    {msg}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-green-500">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full px-2 py-1 bg-[#0f1117] text-white border border-green-400 rounded outline-none"
                  placeholder="Type a message..."
                />
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="w-80 bg-[#10141f] border-l border-green-500 flex flex-col">
              <div className="p-2 border-b border-green-500 text-green-400 font-bold flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span>⚙️ Settings</span>
                </span>
                <X
                  size={16}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => setShowSettings(false)}
                />
              </div>
              <div className="p-4 space-y-4 text-green-400">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-green-500" />
                  <span>Dark Theme</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-green-500" />
                  <span>Autosave</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
