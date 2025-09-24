import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { logout, selectStudentName } from "../store/slices/userSlice";
import { addNotification, openModal } from "../store/slices/uiSlice";
import {
  selectCurrentPoll,
  selectPollResults,
  selectTimeRemaining,
  selectHasVoted,
  selectSelectedOption,
  setSelectedOption,
} from "../store/slices/pollSlice";

// Components
import PollQuestion from "../components/PollQuestion";
import PollResults from "../components/PollResults";
import Timer from "../components/Timer";
import ChatButton from "../components/ChatButton";
import Chat from "../components/Chat";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { isConnected, submitVote } = useSocket();

  const studentName = useSelector(selectStudentName);
  const currentPoll = useSelector(selectCurrentPoll);
  const pollResults = useSelector(selectPollResults);
  const timeRemaining = useSelector(selectTimeRemaining);
  const hasVoted = useSelector(selectHasVoted);
  const selectedOption = useSelector(selectSelectedOption);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (optionId) => {
    if (hasVoted || !currentPoll?.isActive || timeRemaining <= 0) return;
    dispatch(setSelectedOption(optionId));
  };

  const handleSubmitVote = async () => {
    if (selectedOption === null || hasVoted || !currentPoll?.isActive) return;

    setIsSubmitting(true);

    try {
      submitVote(selectedOption);
      dispatch(
        addNotification({
          type: "success",
          title: "Vote Submitted",
          message: "Your vote has been recorded successfully!",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Vote Failed",
          message: error.message || "Failed to submit vote. Please try again.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    dispatch(
      openModal({
        type: "confirm",
        title: "Leave Session",
        content: "Are you sure you want to leave the polling session?",
        onConfirm: () => {
          dispatch(logout());
          dispatch(
            addNotification({
              type: "info",
              title: "Left Session",
              message: "You have left the polling session.",
            })
          );
        },
      })
    );
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return "danger";
    if (timeRemaining <= 30) return "warning";
    return "normal";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Welcome, {studentName}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Student polling session
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

              {/* Chat Button */}
              <ChatButton />

              {/* Leave Session */}
              <button onClick={handleLogout} className="btn-outline text-sm">
                Leave Session
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPoll ? (
          <div className="space-y-6">
            {/* Poll Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      currentPoll.isActive ? "bg-success-500" : "bg-gray-400"
                    }`}
                  >
                    {currentPoll.isActive && (
                      <div className="w-3 h-3 rounded-full bg-success-500 animate-ping absolute"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentPoll.isActive
                        ? "text-success-600"
                        : "text-gray-500"
                    }`}
                  >
                    {currentPoll.isActive ? "Poll Active" : "Poll Ended"}
                  </span>
                </div>

                {currentPoll.isActive && timeRemaining > 0 && (
                  <Timer
                    timeRemaining={timeRemaining}
                    variant={getTimerColor()}
                  />
                )}
              </div>

              {hasVoted && (
                <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-success-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-success-800 font-medium">
                      Vote submitted successfully!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Poll Question */}
            {!hasVoted && currentPoll.isActive && timeRemaining > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <PollQuestion
                  poll={currentPoll}
                  selectedOption={selectedOption}
                  onOptionSelect={handleOptionSelect}
                  onSubmit={handleSubmitVote}
                  isSubmitting={isSubmitting}
                  timeRemaining={timeRemaining}
                />
              </div>
            ) : (
              /* Poll Results */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Poll Results
                  </h2>
                  <p className="text-sm text-gray-500">
                    {hasVoted
                      ? "Thank you for participating!"
                      : "Voting has ended"}
                  </p>
                </div>
                <PollResults
                  poll={pollResults || currentPoll}
                  showHeader={false}
                />
              </div>
            )}

            {/* Poll Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentPoll.question}
              </h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Time limit: {currentPoll.timeLimit} seconds</p>
                <p>
                  Created: {new Date(currentPoll.createdAt).toLocaleString()}
                </p>
                {currentPoll.startTime && (
                  <p>
                    Started: {new Date(currentPoll.startTime).toLocaleString()}
                  </p>
                )}
                {currentPoll.endTime && (
                  <p>Ended: {new Date(currentPoll.endTime).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* No Active Poll */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Waiting for a poll
            </h2>
            <p className="text-gray-500 mb-6">
              Your teacher hasn't started a poll yet. Please wait for the next
              question.
            </p>

            {/* Connection troubleshooting */}
            {!isConnected && (
              <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-warning-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-warning-800">
                    Connection issue detected. Trying to reconnect...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Component */}
      <Chat />
    </div>
  );
};

export default StudentDashboard;
