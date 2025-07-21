import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateFileContent } from "../redux/Slices/fileSlice";
import { io, Socket } from "socket.io-client";

interface FileUpdatePayload {
  fileId: string;
  content: string;
}

interface ActiveUser {
  userId: string;
  userName: string;
}

export const useFileSocket = (
  projectId: string,
  fileId: string,
  userId: string,
  userName: string
) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join-file", { projectId, fileId, userId, userName });

    socket.on("file-updated", (payload: FileUpdatePayload) => {
      if (payload.fileId === fileId) {
        dispatch(updateFileContent(payload));
      }
    });

    socket.on("active-users", (users: ActiveUser[]) => {
      setActiveUsers(users);
    });
    socket.on("user-joined", (user: ActiveUser) => {
      setActiveUsers((prev) => [...prev, user]);
    });
    socket.on("user-left", (user: ActiveUser) => {
      setActiveUsers((prev) => prev.filter(u => u.userId !== user.userId));
    });

    return () => {
      socket.emit("leave-file", { projectId, fileId, userId });
      socket.disconnect();
    };
  }, [projectId, fileId, userId, userName, dispatch]);

  const emitFileUpdate = (content: string) => {
    socketRef.current?.emit("update-file", { fileId, content });
  };

  return { emitFileUpdate, activeUsers };
};
