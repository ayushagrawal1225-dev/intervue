import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  isLoading: false,
  modal: {
    isOpen: false,
    type: null,
    title: "",
    content: "",
    onConfirm: null,
    onCancel: null,
  },
  theme: "light",
  sidebar: {
    isOpen: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        title: "",
        content: "",
        onConfirm: null,
        onCancel: null,
      };
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  openModal,
  closeModal,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectUiLoading = (state) => state.ui.isLoading;
export const selectModal = (state) => state.ui.modal;
export const selectTheme = (state) => state.ui.theme;
export const selectSidebar = (state) => state.ui.sidebar;
