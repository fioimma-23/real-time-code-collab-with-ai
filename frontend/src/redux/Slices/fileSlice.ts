import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface File {
  id: string;
  name: string;
  content: string;
}

interface FileState {
  activeFile: File | null;
  files: File[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  activeFile: null,
  files: [],
  loading: false,
  error: null,
};

export const fetchFileById = createAsyncThunk(
  "file/fetchFileById",
  async ({ projectId, fileId }: { projectId: string; fileId: string }) => {
    const res = await axios.get(`/projects/${projectId}/files/${fileId}`);
    return res.data;
  }
);

export const fetchFilesByProjectId = createAsyncThunk(
  "file/fetchFilesByProjectId",
  async (projectId: string) => {
    const res = await axios.get(`/projects/${projectId}/files`);
    return res.data;
  }
);

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    updateFileContent: (
      state,
      action: PayloadAction<{ fileId: string; content: string }>
    ) => {
      const { fileId, content } = action.payload;
      if (state.activeFile?.id === fileId) {
        state.activeFile.content = content;
      }
    },
    setActiveFile: (state, action: PayloadAction<File>) => {
      state.activeFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeFile = action.payload;
      })
      .addCase(fetchFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch file";
      })
      .addCase(fetchFilesByProjectId.fulfilled, (state, action) => {
        state.files = action.payload;
      });
  },
});

export const { updateFileContent, setActiveFile } = fileSlice.actions;
export default fileSlice.reducer;
