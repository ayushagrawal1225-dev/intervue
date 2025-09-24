import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPoll: null,
  pollHistory: [],
  results: null,
  timeRemaining: 0,
  hasVoted: false,
  selectedOption: null,
  isLoading: false,
  error: null,
  stats: {
    totalPolls: 0,
    connectedStudents: 0,
    teacherConnected: false,
  },
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.hasVoted = false;
      state.selectedOption = null;
      state.error = null;
    },
    updatePollResults: (state, action) => {
      state.results = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setHasVoted: (state, action) => {
      state.hasVoted = action.payload;
    },
    voteSubmitted: (state, action) => {
      state.hasVoted = true;
      state.selectedOption = action.payload.optionId;
      state.results = action.payload.poll;
    },
    pollEnded: (state, action) => {
      if (state.currentPoll) {
        state.currentPoll.isActive = false;
        state.currentPoll.isCompleted = true;
      }
      state.results = action.payload.poll;
      state.timeRemaining = 0;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    addToPollHistory: (state, action) => {
      state.pollHistory.unshift(action.payload);
    },
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
      state.timeRemaining = 0;
      state.hasVoted = false;
      state.selectedOption = null;
      state.error = null;
    },
  },
});

export const {
  setCurrentPoll,
  updatePollResults,
  setTimeRemaining,
  setSelectedOption,
  setHasVoted,
  voteSubmitted,
  pollEnded,
  setPollHistory,
  addToPollHistory,
  setStats,
  setLoading,
  setError,
  clearError,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;

// Selectors
export const selectCurrentPoll = (state) => state.poll.currentPoll;
export const selectPollResults = (state) => state.poll.results;
export const selectTimeRemaining = (state) => state.poll.timeRemaining;
export const selectHasVoted = (state) => state.poll.hasVoted;
export const selectSelectedOption = (state) => state.poll.selectedOption;
export const selectPollHistory = (state) => state.poll.pollHistory;
export const selectPollStats = (state) => state.poll.stats;
export const selectPollLoading = (state) => state.poll.isLoading;
export const selectPollError = (state) => state.poll.error;
