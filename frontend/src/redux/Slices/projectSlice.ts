import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postNewProject } from "../Actions/projectAction";

interface ProjectState {
  projectName: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projectName: "",
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    resetProject: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postNewProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projectName = action.payload.name;
      })
      .addCase(postNewProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProjectName,
  resetProject,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice.reducer;
