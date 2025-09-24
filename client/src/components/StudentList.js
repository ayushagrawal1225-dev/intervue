import React from "react";

const StudentList = ({ students = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          Connected Students ({students.length})
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {students.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(student.joinedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Vote Status */}
                    {student.hasVoted ? (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-success-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-success-600 ml-1">
                          Voted
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400"
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
                        <span className="text-xs text-gray-500 ml-1">
                          Waiting
                        </span>
                      </div>
                    )}

                    {/* Online Status */}
                    <div className="w-2 h-2 bg-success-500 rounded-full">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-ping absolute"></div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h4 className="mt-2 text-sm font-medium text-gray-900">
              No students connected
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Students will appear here when they join the session
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {students.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{students.filter((s) => s.hasVoted).length} voted</span>
            <span>
              {students.length - students.filter((s) => s.hasVoted).length}{" "}
              waiting
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
