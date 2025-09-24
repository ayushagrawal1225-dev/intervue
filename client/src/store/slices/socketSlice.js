import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  instance: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.instance = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.reconnectAttempts = 0;
        state.error = null;
      }
    },
    setConnecting: (state, action) => {
      state.isConnecting = action.payload;
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSocket,
  setConnected,
  setConnecting,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  setError,
  clearError,
} = socketSlice.actions;

export default socketSlice.reducer;

// Selectors
export const selectSocket = (state) => state.socket.instance;
export const selectIsConnected = (state) => state.socket.isConnected;
export const selectIsConnecting = (state) => state.socket.isConnecting;
export const selectSocketError = (state) => state.socket.error;
export const selectReconnectAttempts = (state) =>
  state.socket.reconnectAttempts;
export const selectMaxReconnectAttempts = (state) =>
  state.socket.maxReconnectAttempts;
