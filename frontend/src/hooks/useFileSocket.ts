import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateFileContent } from "../redux/Slices/fileSlice";
import { io, Socket } from "socket.io-client";

interface FileUpdatePayload {
  fileId: string;
  content: string;
}

export const useFileSocket = (projectId: string, fileId: string) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join-file", { projectId, fileId });

    socket.on("file-updated", (payload: FileUpdatePayload) => {
      if (payload.fileId === fileId) {
        dispatch(updateFileContent(payload));
      }
    });

    return () => {
      socket.emit("leave-file", { projectId, fileId });
      socket.disconnect();
    };
  }, [projectId, fileId, dispatch]);

  const emitFileUpdate = (content: string) => {
    socketRef.current?.emit("update-file", { fileId, content });
  };

  return { emitFileUpdate };
};
