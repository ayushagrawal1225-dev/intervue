import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      if (!state.isOpen) {
        state.unreadCount += 1;
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      if (state.isOpen) {
        state.unreadCount = 0;
      }
    },
    openChat: (state) => {
      state.isOpen = true;
      state.unreadCount = 0;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addMessage,
  setMessages,
  toggleChat,
  openChat,
  closeChat,
  clearUnreadCount,
  setLoading,
  setError,
  clearError,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectChatMessages = (state) => state.chat.messages;
export const selectChatIsOpen = (state) => state.chat.isOpen;
export const selectChatUnreadCount = (state) => state.chat.unreadCount;
export const selectChatLoading = (state) => state.chat.isLoading;
export const selectChatError = (state) => state.chat.error;
