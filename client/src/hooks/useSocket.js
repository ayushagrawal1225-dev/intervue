import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import {
  setSocket,
  setConnected,
  setConnecting,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  setError as setSocketError,
  selectSocket,
  selectIsConnected,
  selectReconnectAttempts,
  selectMaxReconnectAttempts,
} from "../store/slices/socketSlice";

import {
  setCurrentPoll,
  updatePollResults,
  setTimeRemaining,
  voteSubmitted,
  pollEnded,
  setPollHistory,
  setStats,
  setError as setPollError,
} from "../store/slices/pollSlice";

import {
  setStudents,
  addStudent,
  removeStudent,
  setError as setUserError,
} from "../store/slices/userSlice";

import {
  addMessage,
  setError as setChatError,
} from "../store/slices/chatSlice";

import { addNotification } from "../store/slices/uiSlice";

import {
  selectUserType,
  selectStudentName,
  selectIsAuthenticated,
} from "../store/slices/userSlice";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);
  const isConnected = useSelector(selectIsConnected);
  const reconnectAttempts = useSelector(selectReconnectAttempts);
  const maxReconnectAttempts = useSelector(selectMaxReconnectAttempts);
  const userType = useSelector(selectUserType);
  const studentName = useSelector(selectStudentName);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const serverUrl =
      process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

    dispatch(setConnecting(true));

    const socketInstance = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    dispatch(setSocket(socketInstance));

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("Connected to server");
      dispatch(setConnected(true));
      dispatch(setConnecting(false));
      dispatch(resetReconnectAttempts());

      // Join appropriate room based on user type
      if (userType === "teacher") {
        socketInstance.emit("join-teacher");
      } else if (userType === "student" && studentName) {
        socketInstance.emit("join-student", { studentName });
      }

      dispatch(
        addNotification({
          type: "success",
          title: "Connected",
          message: "Successfully connected to the server",
        })
      );
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      dispatch(setConnected(false));

      if (reason === "io server disconnect") {
        // Server disconnected, try to reconnect
        socketInstance.connect();
      }

      dispatch(
        addNotification({
          type: "warning",
          title: "Disconnected",
          message: "Connection to server lost. Attempting to reconnect...",
        })
      );
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      dispatch(setSocketError(error.message));
      dispatch(incrementReconnectAttempts());

      if (reconnectAttempts >= maxReconnectAttempts) {
        dispatch(
          addNotification({
            type: "error",
            title: "Connection Failed",
            message:
              "Unable to connect to server. Please check your internet connection.",
          })
        );
      }
    });

    // Teacher-specific event handlers
    socketInstance.on("teacher-joined", (data) => {
      console.log("Teacher joined successfully", data);
      if (data.currentPoll) {
        dispatch(setCurrentPoll(data.currentPoll));
      }
      if (data.stats) {
        dispatch(setStats(data.stats));
      }
      if (data.students) {
        dispatch(setStudents(data.students));
      }
    });

    socketInstance.on("student-connected", (data) => {
      console.log("Student connected:", data.student.name);
      dispatch(addStudent(data.student));
      dispatch(
        addNotification({
          type: "info",
          title: "Student Joined",
          message: `${data.student.name} joined the session`,
        })
      );
    });

    socketInstance.on("student-disconnected", (data) => {
      console.log("Student disconnected:", data.student.name);
      dispatch(removeStudent(data.student));
      dispatch(
        addNotification({
          type: "info",
          title: "Student Left",
          message: `${data.student.name} left the session`,
        })
      );
    });

    // Student-specific event handlers
    socketInstance.on("student-joined", (data) => {
      console.log("Student joined successfully", data);
      if (data.currentPoll) {
        dispatch(setCurrentPoll(data.currentPoll));
      }
    });

    // Common event handlers
    socketInstance.on("new-poll", (poll) => {
      console.log("New poll received:", poll);
      dispatch(setCurrentPoll(poll));
      dispatch(
        addNotification({
          type: "info",
          title: "New Poll",
          message: "A new poll has been started!",
        })
      );
    });

    socketInstance.on("poll-results", (results) => {
      console.log("Poll results updated:", results);
      dispatch(updatePollResults(results));
    });

    socketInstance.on("timer-update", (data) => {
      dispatch(setTimeRemaining(data.timeRemaining));
    });

    socketInstance.on("vote-submitted", (data) => {
      console.log("Vote submitted successfully:", data);
      dispatch(voteSubmitted(data));
      dispatch(
        addNotification({
          type: "success",
          title: "Vote Submitted",
          message: "Your vote has been recorded successfully!",
        })
      );
    });

    socketInstance.on("poll-ended", (data) => {
      console.log("Poll ended:", data);
      dispatch(pollEnded(data));
      dispatch(
        addNotification({
          type: "info",
          title: "Poll Ended",
          message: `Poll ended: ${data.reason}`,
        })
      );
    });

    socketInstance.on("poll-history", (history) => {
      console.log("Poll history received:", history);
      dispatch(setPollHistory(history));
    });

    socketInstance.on("stats-update", (stats) => {
      console.log("Stats updated:", stats);
      dispatch(setStats(stats));
    });

    // Chat event handlers
    socketInstance.on("chat-message", (message) => {
      console.log("Chat message received:", message);
      dispatch(addMessage(message));
    });

    // Error handlers
    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
      dispatch(setPollError(error.message));
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: error.message,
        })
      );
    });

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        dispatch(setSocket(null));
        dispatch(setConnected(false));
      }
    };
  }, [
    dispatch,
    isAuthenticated,
    userType,
    studentName,
    maxReconnectAttempts,
    reconnectAttempts,
  ]);

  // Socket action methods
  const socketActions = {
    createPoll: (pollData) => {
      if (socket && isConnected) {
        socket.emit("create-poll", pollData);
      }
    },

    submitVote: (optionId) => {
      if (socket && isConnected) {
        socket.emit("submit-vote", { optionId });
      }
    },

    endPoll: () => {
      if (socket && isConnected) {
        socket.emit("end-poll");
      }
    },

    getPollHistory: () => {
      if (socket && isConnected) {
        socket.emit("get-poll-history");
      }
    },

    getStats: () => {
      if (socket && isConnected) {
        socket.emit("get-stats");
      }
    },

    sendChatMessage: (message) => {
      if (socket && isConnected) {
        socket.emit("send-chat-message", { message });
      }
    },
  };

  const value = {
    socket,
    isConnected,
    ...socketActions,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
