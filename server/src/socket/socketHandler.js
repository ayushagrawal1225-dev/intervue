const pollManager = require("../models/PollManager");
const logger = require("../utils/logger");

function socketHandler(io) {
  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Handle teacher connection
    socket.on("join-teacher", () => {
      pollManager.setTeacherSocket(socket.id);
      socket.join("teachers");

      // Send current poll state
      const currentPoll = pollManager.getCurrentPoll();
      const stats = pollManager.getStats();

      socket.emit("teacher-joined", {
        currentPoll: currentPoll ? currentPoll.toJSON() : null,
        stats,
        students: pollManager.getAllStudents(),
      });

      logger.info(`Teacher joined: ${socket.id}`);
    });

    // Handle student connection
    socket.on("join-student", (data) => {
      const { studentName } = data;

      if (!studentName || studentName.trim().length === 0) {
        socket.emit("error", { message: "Student name is required" });
        return;
      }

      // Check if name is already taken
      const existingStudents = pollManager.getAllStudents();
      const nameTaken = existingStudents.some(
        (s) => s.name.toLowerCase() === studentName.toLowerCase()
      );

      if (nameTaken) {
        socket.emit("error", {
          message: "Name already taken, please choose another name",
        });
        return;
      }

      const student = pollManager.addStudent(socket.id, studentName);
      socket.join("students");

      // Send current poll state
      const currentPoll = pollManager.getCurrentPoll();

      socket.emit("student-joined", {
        student,
        currentPoll: currentPoll
          ? {
              ...currentPoll.toJSON(),
              hasVoted: currentPoll.hasStudentVoted(studentName),
            }
          : null,
      });

      // Notify teacher about new student
      io.to("teachers").emit("student-connected", {
        student,
        totalStudents: pollManager.getAllStudents().length,
      });

      logger.info(`Student joined: ${studentName} (${socket.id})`);
    });

    // Handle new poll creation (teacher only)
    socket.on("create-poll", (data) => {
      try {
        if (!pollManager.isTeacher(socket.id)) {
          socket.emit("error", { message: "Only teachers can create polls" });
          return;
        }

        const { question, options, timeLimit = 60 } = data;

        if (!question || !options || options.length < 2) {
          socket.emit("error", {
            message: "Question and at least 2 options are required",
          });
          return;
        }

        // Check if teacher can create new poll
        const { canCreate, reason } = pollManager.canCreateNewPoll();
        if (!canCreate) {
          socket.emit("error", { message: reason });
          return;
        }

        const poll = pollManager.createPoll(question, options, timeLimit);

        // Broadcast new poll to all clients
        io.emit("new-poll", poll.toJSON());

        // Start timer
        startPollTimer(poll.id);

        logger.info(`Poll created by teacher: ${poll.id}`);
      } catch (error) {
        logger.error("Error creating poll:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Handle vote submission (student only)
    socket.on("submit-vote", (data) => {
      try {
        const student = pollManager.getStudent(socket.id);
        if (!student) {
          socket.emit("error", { message: "Student not registered" });
          return;
        }

        const { optionId } = data;

        if (typeof optionId !== "number") {
          socket.emit("error", { message: "Invalid option selected" });
          return;
        }

        const poll = pollManager.submitVote(socket.id, optionId);

        // Send confirmation to student
        socket.emit("vote-submitted", {
          optionId,
          poll: poll.toJSON(),
        });

        // Broadcast updated results to all clients
        io.emit("poll-results", poll.getResults());

        // If poll ended (all voted or timer expired), notify all clients
        if (poll.isCompleted) {
          io.emit("poll-ended", {
            poll: poll.toJSON(),
            reason: "All students have voted",
          });
        }

        logger.info(`Vote submitted by ${student.name} for option ${optionId}`);
      } catch (error) {
        logger.error("Error submitting vote:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Handle poll end (teacher only)
    socket.on("end-poll", () => {
      try {
        if (!pollManager.isTeacher(socket.id)) {
          socket.emit("error", { message: "Only teachers can end polls" });
          return;
        }

        const poll = pollManager.endCurrentPoll();
        if (poll) {
          io.emit("poll-ended", {
            poll: poll.toJSON(),
            reason: "Ended by teacher",
          });

          logger.info(`Poll ended by teacher: ${poll.id}`);
        }
      } catch (error) {
        logger.error("Error ending poll:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Handle get poll history (teacher only)
    socket.on("get-poll-history", () => {
      try {
        if (!pollManager.isTeacher(socket.id)) {
          socket.emit("error", {
            message: "Only teachers can view poll history",
          });
          return;
        }

        const history = pollManager.getPollHistory();
        socket.emit("poll-history", history);
      } catch (error) {
        logger.error("Error getting poll history:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Handle get current stats
    socket.on("get-stats", () => {
      const stats = pollManager.getStats();
      socket.emit("stats-update", stats);
    });

    // Handle chat message (bonus feature)
    socket.on("send-chat-message", (data) => {
      try {
        const { message } = data;
        const student = pollManager.getStudent(socket.id);
        const isTeacher = pollManager.isTeacher(socket.id);

        if (!student && !isTeacher) {
          socket.emit("error", { message: "Not authorized to send messages" });
          return;
        }

        const chatMessage = {
          id: Date.now(),
          message,
          sender: isTeacher ? "Teacher" : student.name,
          isTeacher,
          timestamp: new Date().toISOString(),
        };

        // Broadcast message to all clients
        io.emit("chat-message", chatMessage);

        logger.info(`Chat message from ${chatMessage.sender}: ${message}`);
      } catch (error) {
        logger.error("Error sending chat message:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const student = pollManager.getStudent(socket.id);
      const isTeacher = pollManager.isTeacher(socket.id);

      if (isTeacher) {
        pollManager.removeTeacherSocket();
        io.to("students").emit("teacher-disconnected");
        logger.info(`Teacher disconnected: ${socket.id}`);
      } else if (student) {
        pollManager.removeStudent(socket.id);
        io.to("teachers").emit("student-disconnected", {
          student,
          totalStudents: pollManager.getAllStudents().length,
        });
        logger.info(`Student disconnected: ${student.name} (${socket.id})`);
      }

      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // Timer management function
  function startPollTimer(pollId) {
    const poll = pollManager.getCurrentPoll();
    if (!poll || poll.id !== pollId) return;

    const timerInterval = setInterval(() => {
      const currentPoll = pollManager.getCurrentPoll();

      if (!currentPoll || currentPoll.id !== pollId || !currentPoll.isActive) {
        clearInterval(timerInterval);
        return;
      }

      const timeRemaining = currentPoll.getTimeRemaining();

      // Broadcast timer update
      io.emit("timer-update", {
        pollId: currentPoll.id,
        timeRemaining,
      });

      // Check if timer expired
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);

        currentPoll.endPoll();
        pollManager.pollHistory.push(currentPoll.toJSON());

        io.emit("poll-ended", {
          poll: currentPoll.toJSON(),
          reason: "Time expired",
        });

        logger.info(`Poll timer expired: ${pollId}`);
      }
    }, 1000); // Update every second
  }
}

module.exports = socketHandler;
