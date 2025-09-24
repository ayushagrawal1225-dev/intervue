import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAsTeacher, loginAsStudent } from "../store/slices/userSlice";
import { addNotification } from "../store/slices/uiSlice";

const HomePage = () => {
  const [userType, setUserType] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (userType === "teacher") {
        dispatch(loginAsTeacher());
        dispatch(
          addNotification({
            type: "success",
            title: "Welcome Teacher!",
            message: "You have successfully logged in as a teacher.",
          })
        );
        navigate("/teacher");
      } else if (userType === "student") {
        if (!studentName.trim()) {
          setError("Please enter your name");
          setIsLoading(false);
          return;
        }

        if (studentName.trim().length < 2 || studentName.trim().length > 50) {
          setError("Name must be between 2 and 50 characters");
          setIsLoading(false);
          return;
        }

        if (!/^[a-zA-Z0-9\s]+$/.test(studentName.trim())) {
          setError("Name can only contain letters, numbers, and spaces");
          setIsLoading(false);
          return;
        }

        dispatch(loginAsStudent(studentName.trim()));
        dispatch(
          addNotification({
            type: "success",
            title: `Welcome ${studentName.trim()}!`,
            message: "You have successfully joined as a student.",
          })
        );
        navigate("/student");
      } else {
        setError("Please select your role");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setError(error.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <svg
              className="h-8 w-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Live Polling System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join as a teacher to create polls or as a student to participate
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Select your role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("teacher")}
                  className={`relative flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    userType === "teacher"
                      ? "border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 ring-opacity-50"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("student")}
                  className={`relative flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    userType === "student"
                      ? "border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 ring-opacity-50"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Student
                </button>
              </div>
            </div>

            {/* Student Name Input */}
            {userType === "student" && (
              <div className="animate-in slide-in-from-top duration-300">
                <label
                  htmlFor="studentName"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Enter your name
                </label>
                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                  maxLength={50}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-error-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 text-sm text-error-600">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={
                isLoading ||
                !userType ||
                (userType === "student" && !studentName.trim())
              }
              className="btn-primary w-full py-3 text-base font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Joining...
                </div>
              ) : (
                `Join as ${
                  userType === "teacher"
                    ? "Teacher"
                    : userType === "student"
                    ? "Student"
                    : "..."
                }`
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Built with React, Express.js, and Socket.io</p>
          <p className="mt-1">Real-time polling system</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
