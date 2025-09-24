import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "./slices/pollSlice";
import userReducer from "./slices/userSlice";
import socketReducer from "./slices/socketSlice";
import chatReducer from "./slices/chatSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    user: userReducer,
    socket: socketReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.instance"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
