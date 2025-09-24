const { v4: uuidv4 } = require("uuid");

class Poll {
  constructor(question, options, createdBy = "teacher", timeLimit = 60) {
    this.id = uuidv4();
    this.question = question;
    this.options = options.map((option, index) => ({
      id: index,
      text: option,
      votes: 0,
      voters: [], // Track who voted for this option
    }));
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.timeLimit = timeLimit; // in seconds
    this.isActive = true;
    this.isCompleted = false;
    this.startTime = null;
    this.endTime = null;
    this.totalVotes = 0;
    this.participants = new Set(); // Track all participants
    this.voters = new Set(); // Track who has voted
  }

  startPoll() {
    this.startTime = new Date();
    this.isActive = true;
    this.isCompleted = false;
    return this;
  }

  endPoll() {
    this.endTime = new Date();
    this.isActive = false;
    this.isCompleted = true;
    return this;
  }

  addVote(optionId, studentName) {
    // Check if student already voted
    if (this.voters.has(studentName)) {
      throw new Error("Student has already voted");
    }

    // Check if poll is active
    if (!this.isActive) {
      throw new Error("Poll is not active");
    }

    // Check if option exists
    const option = this.options.find((opt) => opt.id === optionId);
    if (!option) {
      throw new Error("Invalid option selected");
    }

    // Add vote
    option.votes++;
    option.voters.push(studentName);
    this.voters.add(studentName);
    this.totalVotes++;

    return this;
  }

  addParticipant(studentName) {
    this.participants.add(studentName);
    return this;
  }

  getResults() {
    return {
      id: this.id,
      question: this.question,
      options: this.options.map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
        percentage:
          this.totalVotes > 0
            ? Math.round((option.votes / this.totalVotes) * 100)
            : 0,
      })),
      totalVotes: this.totalVotes,
      totalParticipants: this.participants.size,
      isActive: this.isActive,
      isCompleted: this.isCompleted,
      timeLimit: this.timeLimit,
      startTime: this.startTime,
      endTime: this.endTime,
      createdAt: this.createdAt,
    };
  }

  getTimeRemaining() {
    if (!this.startTime || this.isCompleted) {
      return 0;
    }

    const elapsed = Math.floor((new Date() - this.startTime) / 1000);
    const remaining = Math.max(0, this.timeLimit - elapsed);

    if (remaining === 0 && this.isActive) {
      this.endPoll();
    }

    return remaining;
  }

  hasStudentVoted(studentName) {
    return this.voters.has(studentName);
  }

  canAcceptVotes() {
    return this.isActive && !this.isCompleted && this.getTimeRemaining() > 0;
  }

  // Serialize for JSON transmission
  toJSON() {
    return {
      id: this.id,
      question: this.question,
      options: this.options.map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
        percentage:
          this.totalVotes > 0
            ? Math.round((option.votes / this.totalVotes) * 100)
            : 0,
      })),
      totalVotes: this.totalVotes,
      totalParticipants: this.participants.size,
      isActive: this.isActive,
      isCompleted: this.isCompleted,
      timeLimit: this.timeLimit,
      timeRemaining: this.getTimeRemaining(),
      startTime: this.startTime,
      endTime: this.endTime,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
    };
  }
}

module.exports = Poll;
