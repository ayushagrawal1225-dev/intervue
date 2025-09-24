const Poll = require("./Poll");
const logger = require("../utils/logger");

class PollManager {
  constructor() {
    this.polls = new Map(); // pollId -> Poll
    this.activePoll = null; // Current active poll
    this.pollHistory = []; // Array of completed polls
    this.students = new Map(); // socketId -> studentInfo
    this.teacherSocket = null; // Teacher's socket connection
  }

  // Teacher methods
  createPoll(question, options, timeLimit = 60) {
    // Only allow new poll if no active poll or all students have answered
    if (this.activePoll && this.activePoll.isActive) {
      const allStudentsAnswered =
        this.activePoll.voters.size === this.activePoll.participants.size;
      if (!allStudentsAnswered && this.activePoll.participants.size > 0) {
        throw new Error(
          "Cannot create new poll while current poll is active and students haven't answered"
        );
      }
    }

    const poll = new Poll(question, options, "teacher", timeLimit);
    this.polls.set(poll.id, poll);

    // End previous poll if exists
    if (this.activePoll) {
      this.activePoll.endPoll();
      this.pollHistory.push(this.activePoll.toJSON());
    }

    this.activePoll = poll;
    poll.startPoll();

    logger.info(`New poll created: ${poll.id} - "${question}"`);
    return poll;
  }

  getCurrentPoll() {
    return this.activePoll;
  }

  endCurrentPoll() {
    if (this.activePoll && this.activePoll.isActive) {
      this.activePoll.endPoll();
      this.pollHistory.push(this.activePoll.toJSON());
      logger.info(`Poll ended: ${this.activePoll.id}`);
      return this.activePoll;
    }
    return null;
  }

  // Student methods
  addStudent(socketId, studentName) {
    const studentInfo = {
      id: socketId,
      name: studentName,
      joinedAt: new Date(),
      hasVoted: false,
    };

    this.students.set(socketId, studentInfo);

    // Add to current poll if exists
    if (this.activePoll) {
      this.activePoll.addParticipant(studentName);
    }

    logger.info(`Student joined: ${studentName} (${socketId})`);
    return studentInfo;
  }

  removeStudent(socketId) {
    const student = this.students.get(socketId);
    if (student) {
      this.students.delete(socketId);
      logger.info(`Student left: ${student.name} (${socketId})`);
    }
  }

  getStudent(socketId) {
    return this.students.get(socketId);
  }

  getAllStudents() {
    return Array.from(this.students.values());
  }

  // Voting methods
  submitVote(socketId, optionId) {
    const student = this.students.get(socketId);
    if (!student) {
      throw new Error("Student not found");
    }

    if (!this.activePoll) {
      throw new Error("No active poll");
    }

    if (!this.activePoll.canAcceptVotes()) {
      throw new Error("Poll is not accepting votes");
    }

    // Submit vote
    this.activePoll.addVote(optionId, student.name);
    student.hasVoted = true;

    logger.info(`Vote submitted by ${student.name} for option ${optionId}`);

    // Check if all students have voted
    if (
      this.activePoll.voters.size === this.activePoll.participants.size &&
      this.activePoll.participants.size > 0
    ) {
      this.activePoll.endPoll();
      this.pollHistory.push(this.activePoll.toJSON());
      logger.info(
        `Poll automatically ended - all students voted: ${this.activePoll.id}`
      );
    }

    return this.activePoll;
  }

  // Teacher socket management
  setTeacherSocket(socketId) {
    this.teacherSocket = socketId;
    logger.info(`Teacher connected: ${socketId}`);
  }

  removeTeacherSocket() {
    const oldSocket = this.teacherSocket;
    this.teacherSocket = null;
    logger.info(`Teacher disconnected: ${oldSocket}`);
  }

  isTeacher(socketId) {
    return this.teacherSocket === socketId;
  }

  // Poll history and statistics
  getPollHistory() {
    return this.pollHistory;
  }

  getStats() {
    return {
      totalPolls: this.polls.size,
      activePoll: this.activePoll ? this.activePoll.toJSON() : null,
      connectedStudents: this.students.size,
      teacherConnected: !!this.teacherSocket,
      pollHistory: this.pollHistory.length,
    };
  }

  // Timer management
  startPollTimer() {
    if (!this.activePoll || !this.activePoll.isActive) {
      return;
    }

    const checkTimer = () => {
      if (this.activePoll && this.activePoll.isActive) {
        const timeRemaining = this.activePoll.getTimeRemaining();

        if (timeRemaining <= 0) {
          this.activePoll.endPoll();
          this.pollHistory.push(this.activePoll.toJSON());
          logger.info(`Poll timer expired: ${this.activePoll.id}`);
          return { expired: true, poll: this.activePoll };
        }

        return { expired: false, timeRemaining };
      }
      return { expired: true };
    };

    return checkTimer;
  }

  // Validation methods
  canCreateNewPoll() {
    if (!this.activePoll) {
      return { canCreate: true, reason: null };
    }

    if (!this.activePoll.isActive) {
      return { canCreate: true, reason: null };
    }

    const allStudentsAnswered =
      this.activePoll.voters.size === this.activePoll.participants.size;
    if (this.activePoll.participants.size === 0) {
      return { canCreate: true, reason: null };
    }

    if (!allStudentsAnswered) {
      return {
        canCreate: false,
        reason: "Wait for all students to answer the current question",
      };
    }

    return { canCreate: true, reason: null };
  }
}

// Singleton instance
const pollManager = new PollManager();

module.exports = pollManager;
