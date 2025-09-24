import React, { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/uiSlice";

const PollCreator = ({ canCreate = true }) => {
  const { createPoll } = useSocket();
  const dispatch = useDispatch();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!question.trim()) {
      newErrors.question = "Question is required";
    } else if (question.trim().length < 5) {
      newErrors.question = "Question must be at least 5 characters";
    } else if (question.trim().length > 500) {
      newErrors.question = "Question must not exceed 500 characters";
    }

    const validOptions = options.filter((opt) => opt.trim().length > 0);
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    options.forEach((option, index) => {
      if (option.trim().length > 0 && option.trim().length > 200) {
        newErrors[`option${index}`] = "Option must not exceed 200 characters";
      }
    });

    if (timeLimit < 10 || timeLimit > 300) {
      newErrors.timeLimit = "Time limit must be between 10 and 300 seconds";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // Clear error for this option
    if (errors[`option${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`option${index}`];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canCreate) {
      dispatch(
        addNotification({
          type: "warning",
          title: "Cannot Create Poll",
          message:
            "Wait for all students to answer the current question before creating a new poll.",
        })
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      const validOptions = options.filter((opt) => opt.trim().length > 0);

      createPoll({
        question: question.trim(),
        options: validOptions.map((opt) => opt.trim()),
        timeLimit: timeLimit,
      });

      // Reset form
      setQuestion("");
      setOptions(["", ""]);
      setTimeLimit(60);
      setErrors({});

      dispatch(
        addNotification({
          type: "success",
          title: "Poll Created",
          message: "Your poll has been created and is now active!",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Failed to Create Poll",
          message:
            error.message || "An error occurred while creating the poll.",
        })
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setOptions(["", ""]);
    setTimeLimit(60);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Create New Poll</h3>
        <p className="text-sm text-gray-500 mt-1">
          Create an engaging poll for your students
        </p>
      </div>

      {!canCreate && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-warning-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-warning-800">
                Cannot create new poll
              </h4>
              <p className="text-sm text-warning-700 mt-1">
                Wait for all students to answer the current question before
                creating a new poll.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Input */}
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Poll Question *
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question) {
                setErrors((prev) => ({ ...prev, question: undefined }));
              }
            }}
            placeholder="Enter your poll question here..."
            rows={3}
            maxLength={500}
            className={`input resize-none ${
              errors.question
                ? "border-error-300 focus:border-error-500 focus:ring-error-500"
                : ""
            }`}
          />
          <div className="flex justify-between mt-1">
            <div>
              {errors.question && (
                <p className="text-sm text-error-600">{errors.question}</p>
              )}
            </div>
            <p className="text-sm text-gray-500">{question.length}/500</p>
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options *
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              disabled={options.length >= 6}
              className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              + Add Option
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    maxLength={200}
                    className={`input ${
                      errors[`option${index}`]
                        ? "border-error-300 focus:border-error-500 focus:ring-error-500"
                        : ""
                    }`}
                  />
                  {errors[`option${index}`] && (
                    <p className="text-sm text-error-600 mt-1">
                      {errors[`option${index}`]}
                    </p>
                  )}
                </div>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-error-600 hover:text-error-700 p-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.options && (
            <p className="text-sm text-error-600 mt-2">{errors.options}</p>
          )}

          <p className="text-sm text-gray-500 mt-2">
            You can add up to 6 options. At least 2 options are required.
          </p>
        </div>

        {/* Time Limit */}
        <div>
          <label
            htmlFor="timeLimit"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Time Limit (seconds)
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="timeLimit"
              type="number"
              min="10"
              max="300"
              value={timeLimit}
              onChange={(e) => {
                setTimeLimit(parseInt(e.target.value) || 60);
                if (errors.timeLimit) {
                  setErrors((prev) => ({ ...prev, timeLimit: undefined }));
                }
              }}
              className={`input w-32 ${
                errors.timeLimit
                  ? "border-error-300 focus:border-error-500 focus:ring-error-500"
                  : ""
              }`}
            />
            <div className="flex space-x-2">
              {[30, 60, 90, 120].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTimeLimit(preset)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    timeLimit === preset
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {preset}s
                </button>
              ))}
            </div>
          </div>
          {errors.timeLimit && (
            <p className="text-sm text-error-600 mt-1">{errors.timeLimit}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Students will have this much time to answer the poll
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline"
            disabled={isCreating}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isCreating || !canCreate}
            className="btn-primary"
          >
            {isCreating ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Poll"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PollCreator;
