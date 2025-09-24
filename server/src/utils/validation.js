/**
 * Validation utilities for the polling system
 */

// Sanitize text input to prevent XSS (basic implementation)
const sanitizeText = (text) => {
  if (typeof text !== "string") return "";

  // Remove HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>'"&]/g, "") // Remove dangerous characters
    .trim();
};

// Validate poll question
const validateQuestion = (question) => {
  const errors = [];

  if (!question || typeof question !== "string") {
    errors.push("Question is required and must be a string");
    return { isValid: false, errors };
  }

  const sanitized = sanitizeText(question);

  if (sanitized.length < 5) {
    errors.push("Question must be at least 5 characters long");
  }

  if (sanitized.length > 500) {
    errors.push("Question must not exceed 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

// Validate poll options
const validateOptions = (options) => {
  const errors = [];

  if (!Array.isArray(options)) {
    errors.push("Options must be an array");
    return { isValid: false, errors };
  }

  if (options.length < 2) {
    errors.push("At least 2 options are required");
  }

  if (options.length > 6) {
    errors.push("Maximum 6 options allowed");
  }

  const sanitizedOptions = [];

  options.forEach((option, index) => {
    if (typeof option !== "string") {
      errors.push(`Option ${index + 1} must be a string`);
      return;
    }

    const sanitized = sanitizeText(option);

    if (sanitized.length === 0) {
      errors.push(`Option ${index + 1} cannot be empty`);
      return;
    }

    if (sanitized.length > 200) {
      errors.push(`Option ${index + 1} must not exceed 200 characters`);
      return;
    }

    sanitizedOptions.push(sanitized);
  });

  // Check for duplicate options
  const uniqueOptions = [
    ...new Set(sanitizedOptions.map((opt) => opt.toLowerCase())),
  ];
  if (uniqueOptions.length !== sanitizedOptions.length) {
    errors.push("Duplicate options are not allowed");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: sanitizedOptions,
  };
};

// Validate student name
const validateStudentName = (name) => {
  const errors = [];

  if (!name || typeof name !== "string") {
    errors.push("Student name is required and must be a string");
    return { isValid: false, errors };
  }

  const sanitized = sanitizeText(name);

  if (sanitized.length < 2) {
    errors.push("Student name must be at least 2 characters long");
  }

  if (sanitized.length > 50) {
    errors.push("Student name must not exceed 50 characters");
  }

  // Only allow letters, numbers, and spaces
  if (!/^[a-zA-Z0-9\s]+$/.test(sanitized)) {
    errors.push("Student name can only contain letters, numbers, and spaces");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

// Validate time limit
const validateTimeLimit = (timeLimit) => {
  const errors = [];

  if (timeLimit !== undefined) {
    if (typeof timeLimit !== "number" || !Number.isInteger(timeLimit)) {
      errors.push("Time limit must be a number");
    } else if (timeLimit < 10) {
      errors.push("Time limit must be at least 10 seconds");
    } else if (timeLimit > 300) {
      errors.push("Time limit must not exceed 300 seconds (5 minutes)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: timeLimit || 60,
  };
};

// Validate option ID for voting
const validateOptionId = (optionId, totalOptions) => {
  const errors = [];

  if (typeof optionId !== "number" || !Number.isInteger(optionId)) {
    errors.push("Option ID must be a number");
    return { isValid: false, errors };
  }

  if (optionId < 0 || optionId >= totalOptions) {
    errors.push("Invalid option selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: optionId,
  };
};

// Validate chat message
const validateChatMessage = (message) => {
  const errors = [];

  if (!message || typeof message !== "string") {
    errors.push("Message is required and must be a string");
    return { isValid: false, errors };
  }

  const sanitized = sanitizeText(message);

  if (sanitized.length === 0) {
    errors.push("Message cannot be empty");
  }

  if (sanitized.length > 1000) {
    errors.push("Message must not exceed 1000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

module.exports = {
  sanitizeText,
  validateQuestion,
  validateOptions,
  validateStudentName,
  validateTimeLimit,
  validateOptionId,
  validateChatMessage,
};
