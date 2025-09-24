const express = require("express");
const { body, validationResult } = require("express-validator");
const pollManager = require("../models/PollManager");
const logger = require("../utils/logger");

const router = express.Router();

// Validation middleware
const validatePoll = [
  body("question")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Question must be between 5 and 500 characters"),
  body("options")
    .isArray({ min: 2, max: 6 })
    .withMessage("Must provide between 2 and 6 options"),
  body("options.*")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Each option must be between 1 and 200 characters"),
  body("timeLimit")
    .optional()
    .isInt({ min: 10, max: 300 })
    .withMessage("Time limit must be between 10 and 300 seconds"),
];

const validateStudentName = [
  body("studentName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Student name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Student name can only contain letters, numbers, and spaces"),
];

// Error handling middleware for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// GET /api/polls - Get all polls (for debugging/admin)
router.get("/", (req, res) => {
  try {
    const stats = pollManager.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Error getting polls:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// GET /api/polls/current - Get current active poll
router.get("/current", (req, res) => {
  try {
    const currentPoll = pollManager.getCurrentPoll();

    res.json({
      success: true,
      data: currentPoll ? currentPoll.toJSON() : null,
    });
  } catch (error) {
    logger.error("Error getting current poll:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// GET /api/polls/history - Get poll history
router.get("/history", (req, res) => {
  try {
    const history = pollManager.getPollHistory();

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error("Error getting poll history:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// POST /api/polls - Create a new poll
router.post("/", validatePoll, handleValidationErrors, (req, res) => {
  try {
    const { question, options, timeLimit = 60 } = req.body;

    // Check if can create new poll
    const { canCreate, reason } = pollManager.canCreateNewPoll();
    if (!canCreate) {
      return res.status(409).json({
        error: "Cannot create poll",
        message: reason,
      });
    }

    const poll = pollManager.createPoll(question, options, timeLimit);

    logger.info(`Poll created via API: ${poll.id}`);

    res.status(201).json({
      success: true,
      data: poll.toJSON(),
      message: "Poll created successfully",
    });
  } catch (error) {
    logger.error("Error creating poll:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// POST /api/polls/:id/vote - Submit a vote
router.post(
  "/:id/vote",
  [
    body("optionId")
      .isInt({ min: 0 })
      .withMessage("Option ID must be a valid number"),
    body("studentName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Student name must be between 2 and 50 characters"),
  ],
  handleValidationErrors,
  (req, res) => {
    try {
      const { id: pollId } = req.params;
      const { optionId, studentName } = req.body;

      const currentPoll = pollManager.getCurrentPoll();

      if (!currentPoll || currentPoll.id !== pollId) {
        return res.status(404).json({
          error: "Poll not found",
          message: "The specified poll does not exist or is not active",
        });
      }

      if (!currentPoll.canAcceptVotes()) {
        return res.status(409).json({
          error: "Poll not accepting votes",
          message: "Poll has ended or time has expired",
        });
      }

      if (currentPoll.hasStudentVoted(studentName)) {
        return res.status(409).json({
          error: "Already voted",
          message: "Student has already voted in this poll",
        });
      }

      // Add vote
      currentPoll.addVote(optionId, studentName);

      logger.info(
        `Vote submitted via API by ${studentName} for option ${optionId}`
      );

      res.json({
        success: true,
        data: currentPoll.getResults(),
        message: "Vote submitted successfully",
      });
    } catch (error) {
      logger.error("Error submitting vote:", error);

      if (
        error.message.includes("already voted") ||
        error.message.includes("not active")
      ) {
        return res.status(409).json({
          error: "Voting error",
          message: error.message,
        });
      }

      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

// POST /api/polls/validate-student - Validate student name
router.post(
  "/validate-student",
  validateStudentName,
  handleValidationErrors,
  (req, res) => {
    try {
      const { studentName } = req.body;

      // Check if name is already taken
      const existingStudents = pollManager.getAllStudents();
      const nameTaken = existingStudents.some(
        (s) => s.name.toLowerCase() === studentName.toLowerCase()
      );

      if (nameTaken) {
        return res.status(409).json({
          error: "Name taken",
          message: "This name is already taken, please choose another one",
        });
      }

      res.json({
        success: true,
        message: "Student name is available",
      });
    } catch (error) {
      logger.error("Error validating student name:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

// DELETE /api/polls/current - End current poll
router.delete("/current", (req, res) => {
  try {
    const poll = pollManager.endCurrentPoll();

    if (!poll) {
      return res.status(404).json({
        error: "No active poll",
        message: "There is no active poll to end",
      });
    }

    logger.info(`Poll ended via API: ${poll.id}`);

    res.json({
      success: true,
      data: poll.toJSON(),
      message: "Poll ended successfully",
    });
  } catch (error) {
    logger.error("Error ending poll:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// GET /api/polls/stats - Get polling statistics
router.get("/stats", (req, res) => {
  try {
    const stats = pollManager.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Error getting stats:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

module.exports = router;
