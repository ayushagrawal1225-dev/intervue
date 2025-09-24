import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectUserType,
} from "./store/slices/userSlice";
import { SocketProvider } from "./hooks/useSocket";

// Pages
import HomePage from "./pages/HomePage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Components
import Notifications from "./components/Notifications";
import Modal from "./components/Modal";
import ErrorBoundary from "./components/ErrorBoundary";

function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/teacher"
        element={
          userType === "teacher" ? (
            <TeacherDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/student"
        element={
          userType === "student" ? (
            <StudentDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          userType === "teacher" ? (
            <Navigate to="/teacher" replace />
          ) : (
            <Navigate to="/student" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <SocketProvider>
          <AppContent />
          <Notifications />
          <Modal />
        </SocketProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
