// src/redux/projectSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  projectName: string;
}

const initialState: ProjectState = {
  projectName: "",
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    resetProject: () => initialState,
  },
});

export const { setProjectName, resetProject } = projectSlice.actions;
export default projectSlice.reducer;
