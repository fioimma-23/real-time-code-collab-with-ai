import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
  roomId: string;
}

const initialState: RoomState = {
  roomId: "", // Default value for roomId is an empty string
};

const roomSlice = createSlice({
  name: "room", 
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload; // Sets the roomId in the state
    },
    resetRoom: () => initialState, // Resets room state to initial state
  },
});

export const { setRoomId, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;
