import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { logout } from "../store/slices/userSlice";
import { addNotification, openModal } from "../store/slices/uiSlice";
import {
  selectCurrentPoll,
  selectPollResults,
  selectTimeRemaining,
  selectPollHistory,
  selectPollStats,
} from "../store/slices/pollSlice";
import { selectStudents } from "../store/slices/userSlice";
import { toggleChat } from "../store/slices/chatSlice";

// Components
import PollCreator from "../components/PollCreator";
import PollResults from "../components/PollResults";
import StudentList from "../components/StudentList";
import Timer from "../components/Timer";
import ChatButton from "../components/ChatButton";
import Chat from "../components/Chat";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { isConnected, endPoll, getPollHistory, getStats } = useSocket();

  const currentPoll = useSelector(selectCurrentPoll);
  const pollResults = useSelector(selectPollResults);
  const timeRemaining = useSelector(selectTimeRemaining);
  const pollHistory = useSelector(selectPollHistory);
  const stats = useSelector(selectPollStats);
  const students = useSelector(selectStudents);

  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    // Fetch initial data
    getPollHistory();
    getStats();
  }, [getPollHistory, getStats]);

  const handleEndPoll = () => {
    if (currentPoll && currentPoll.isActive) {
      dispatch(
        openModal({
          type: "confirm",
          title: "End Poll",
          content:
            "Are you sure you want to end the current poll? This action cannot be undone.",
          onConfirm: () => {
            endPoll();
            dispatch(
              addNotification({
                type: "success",
                title: "Poll Ended",
                message: "The poll has been ended successfully.",
              })
            );
          },
        })
      );
    }
  };

  const handleLogout = () => {
    dispatch(
      openModal({
        type: "confirm",
        title: "Logout",
        content:
          "Are you sure you want to logout? This will end the current session.",
        onConfirm: () => {
          dispatch(logout());
          dispatch(
            addNotification({
              type: "info",
              title: "Logged Out",
              message: "You have been logged out successfully.",
            })
          );
        },
      })
    );
  };

  const canCreateNewPoll = () => {
    if (!currentPoll) return true;
    if (!currentPoll.isActive) return true;
    if (students.length === 0) return true;

    // Check if all students have voted
    const votedStudents = pollResults?.totalVotes || 0;
    const totalStudents = students.length;

    return votedStudents === totalStudents;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
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
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Teacher Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your polling sessions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-success-500" : "bg-error-500"
                  }`}
                >
                  {isConnected && (
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-ping absolute"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isConnected ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span>{students.length} Students</span>
                <span>{stats.totalPolls} Polls</span>
              </div>

              {/* Chat Button */}
              <ChatButton />

              {/* Logout */}
              <button onClick={handleLogout} className="btn-outline text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("current")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "current"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Current Poll
                  </button>
                  <button
                    onClick={() => setActiveTab("create")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "create"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Create Poll
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "history"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    History
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "current" && (
                  <div className="space-y-6">
                    {currentPoll ? (
                      <>
                        {/* Poll Info */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {currentPoll.question}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Created{" "}
                              {new Date(currentPoll.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Timer timeRemaining={timeRemaining} />
                            {currentPoll.isActive && (
                              <button
                                onClick={handleEndPoll}
                                className="btn-error text-sm"
                              >
                                End Poll
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Poll Results */}
                        <PollResults poll={pollResults || currentPoll} />
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No active poll
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Create a new poll to get started
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => setActiveTab("create")}
                            className="btn-primary"
                          >
                            Create Poll
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "create" && (
                  <PollCreator canCreate={canCreateNewPoll()} />
                )}

                {activeTab === "history" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Poll History
                    </h3>
                    {pollHistory.length > 0 ? (
                      <div className="space-y-4">
                        {pollHistory.map((poll, index) => (
                          <div
                            key={poll.id || index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {poll.question}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(poll.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>{poll.totalVotes} votes</span>
                              <span className="mx-2">•</span>
                              <span>{poll.totalParticipants} participants</span>
                            </div>
                            <PollResults poll={poll} showHeader={false} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No polls created yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudentList students={students} />
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <Chat />
    </div>
  );
};

export default TeacherDashboard;
