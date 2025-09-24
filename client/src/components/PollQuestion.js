import React from "react";

const PollQuestion = ({
  poll,
  selectedOption,
  onOptionSelect,
  onSubmit,
  isSubmitting = false,
  timeRemaining = 0,
}) => {
  const canSubmit =
    selectedOption !== null && !isSubmitting && timeRemaining > 0;

  return (
    <div className="space-y-6">
      {/* Question */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {poll.question}
        </h2>
        <p className="text-sm text-gray-500">
          Select one option and submit your answer
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionSelect(option.id)}
            disabled={isSubmitting || timeRemaining <= 0}
            className={`poll-option w-full text-left transition-all duration-200 ${
              selectedOption === option.id ? "selected" : ""
            } ${isSubmitting || timeRemaining <= 0 ? "disabled" : ""}`}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 border-2 rounded-full mr-3 ${
                  selectedOption === option.id
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <span className="text-gray-900 font-medium">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`btn-primary px-8 py-3 text-base font-medium ${
            !canSubmit ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="loading-spinner mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Vote"
          )}
        </button>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        {timeRemaining <= 0 ? (
          <p className="text-error-600 text-sm font-medium">
            Time's up! Voting has ended.
          </p>
        ) : selectedOption === null ? (
          <p className="text-gray-500 text-sm">
            Please select an option to submit your vote
          </p>
        ) : (
          <p className="text-primary-600 text-sm">
            Click "Submit Vote" to confirm your selection
          </p>
        )}
      </div>
    </div>
  );
};

export default PollQuestion;
