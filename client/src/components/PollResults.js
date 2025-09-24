import React from "react";

const PollResults = ({ poll, showHeader = true }) => {
  if (!poll) return null;

  const totalVotes = poll.totalVotes || 0;
  const hasVotes = totalVotes > 0;

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Results</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{totalVotes} votes</span>
            <span>•</span>
            <span>{poll.totalParticipants || 0} participants</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage = hasVotes ? option.percentage || 0 : 0;
          const votes = option.votes || 0;

          return (
            <div key={option.id || index} className="space-y-2">
              {/* Option Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {option.text}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{votes} votes</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!hasVotes && (
        <div className="text-center py-6">
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
          <h4 className="mt-2 text-sm font-medium text-gray-900">
            No votes yet
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Results will appear as students submit their votes
          </p>
        </div>
      )}

      {/* Poll Status */}
      {poll.isCompleted && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center">
            <svg
              className="h-5 w-5 text-gray-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Poll Completed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults;
