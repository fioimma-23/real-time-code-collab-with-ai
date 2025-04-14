import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const postNewProject = createAsyncThunk(
  "project/postNewProject",
  async (projectName: string, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:5000/api/projects", {
        name: projectName,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
