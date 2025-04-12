import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplyTheme } from "../hooks/useApplyTheme";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Play,
  MessageCircle,
  Users,
  Settings,
  Share2,
  FileText,
  X,
} from "lucide-react";

const EditorPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  useApplyTheme();

  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}`);
  const [output, setOutput] = useState("");
  const [lineEditors, setLineEditors] = useState<{ [line: number]: string }>({});

  const currentUser = "Ananya"; // In real usage, get from auth/session
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [autosave, setAutosave] = useState(false);

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>(["Ananya", "Ajay", "Sai"]);

  const editorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e: any) => {
      const line = e.position.lineNumber;
      setLineEditors((prev) => ({ ...prev, [line]: currentUser }));
    });
  };

  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    const decorations = Object.entries(lineEditors).map(([line, user]) => ({
      range: new monaco.Range(Number(line), 1, Number(line), 1),
      options: {
        isWholeLine: false,
        after: {
          contentText: `👤 ${user}`,
          inlineClassName: "inline-user-label",
        },
      },
    }));

    editorRef.current.deltaDecorations([], decorations);
  }, [lineEditors, monaco]);

  const handleRun = () => {
    if (code.includes('printf("Hello, world!')) {
      setOutput("Hello, world!");
    } else {
      setOutput("Code ran successfully.");
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, `${currentUser}: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className="h-screen flex bg-[var(--bg)] text-[var(--text)] font-mono">
      {/* Sidebar */}
      <div className="w-14 bg-[var(--bg-dark)] flex flex-col items-center py-4 space-y-6 border-r border-neonGreen">
        <FileText className="text-neonGreen w-5 h-5 hover:text-white" />
        <MessageCircle onClick={() => setShowChat(!showChat)} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Play onClick={handleRun} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Users onClick={() => setShowCollaborators(!showCollaborators)} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Settings onClick={() => setShowSettings(!showSettings)} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Share2 className="text-neonGreen w-5 h-5 hover:text-white" />
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col m-4 border border-neonGreen rounded overflow-hidden">
        {/* Topbar */}
        <div className="bg-[var(--bg)] text-neonGreen font-bold p-2 text-sm border-b border-neonGreen flex justify-between items-center">
          <span>Room: {roomId}</span>
          <button onClick={() => navigate("/home")} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">
            Leave
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="c"
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={editorDidMount}
            theme={darkTheme ? "vs-dark" : "light"}
            options={{
              fontSize: 14,
              fontFamily: "monospace",
              minimap: { enabled: false },
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Run Output */}
        <div className="bg-[var(--bg-dark)] border-t border-neonGreen p-4">
          <p className="text-neonGreen font-bold mb-2">Run Code</p>
          <button onClick={handleRun} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4">
            Run
          </button>
          <div className="text-white bg-[var(--bg)] border border-neonGreen rounded p-4 whitespace-pre-wrap">
            <p className="text-neonGreen mb-2">Output:</p>
            {output || "Your output will appear here..."}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="w-80 bg-[var(--bg-dark)] border-l border-neonGreen flex flex-col">
          <div className="p-2 border-b border-neonGreen text-neonGreen font-bold flex items-center justify-between">
            <span>💬 Chat</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowChat(false)} />
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-sm bg-[var(--bg)] p-2 rounded text-white">
                {msg}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-neonGreen">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full px-2 py-1 bg-[var(--bg)] text-white border border-neonGreen rounded outline-none"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="w-80 bg-[var(--bg-dark)] border-l border-neonGreen p-4">
          <div className="flex items-center justify-between text-neonGreen font-bold border-b border-neonGreen mb-4">
            <span>⚙️ Settings</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowSettings(false)} />
          </div>
          <label className="flex items-center space-x-2 mb-2 text-white">
            <input type="checkbox" checked={darkTheme} onChange={(e) => setDarkTheme(e.target.checked)} />
            <span>Dark Theme</span>
          </label>
          <label className="flex items-center space-x-2 text-white">
            <input type="checkbox" checked={autosave} onChange={(e) => setAutosave(e.target.checked)} />
            <span>Autosave</span>
          </label>
        </div>
      )}

      {/* Collaborators Sidebar */}
      {showCollaborators && (
        <div className="w-80 bg-[var(--bg-dark)] border-l border-neonGreen p-4">
          <div className="flex items-center justify-between text-neonGreen font-bold border-b border-neonGreen mb-4">
            <span>👥 Collaborators</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowCollaborators(false)} />
          </div>
          <div className="text-white space-y-2">
            {collaborators.map((user, index) => (
              <div key={index} className="bg-[var(--bg)] p-2 rounded text-sm">
                {user}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
