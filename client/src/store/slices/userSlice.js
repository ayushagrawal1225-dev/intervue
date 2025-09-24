import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userType: null, // 'teacher' or 'student'
  studentName: "",
  teacherId: null,
  joinedAt: null,
  students: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAsTeacher: (state) => {
      state.isAuthenticated = true;
      state.userType = "teacher";
      state.teacherId = Date.now();
      state.joinedAt = new Date().toISOString();
      state.error = null;
    },
    loginAsStudent: (state, action) => {
      state.isAuthenticated = true;
      state.userType = "student";
      state.studentName = action.payload;
      state.joinedAt = new Date().toISOString();
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userType = null;
      state.studentName = "";
      state.teacherId = null;
      state.joinedAt = null;
      state.students = [];
      state.error = null;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      const existingStudent = state.students.find(
        (s) => s.id === action.payload.id
      );
      if (!existingStudent) {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter((s) => s.id !== action.payload.id);
    },
    updateStudentVoteStatus: (state, action) => {
      const { studentName, hasVoted } = action.payload;
      const student = state.students.find((s) => s.name === studentName);
      if (student) {
        student.hasVoted = hasVoted;
      }
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
  },
});

export const {
  loginAsTeacher,
  loginAsStudent,
  logout,
  setStudents,
  addStudent,
  removeStudent,
  updateStudentVoteStatus,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserType = (state) => state.user.userType;
export const selectStudentName = (state) => state.user.studentName;
export const selectTeacherId = (state) => state.user.teacherId;
export const selectStudents = (state) => state.user.students;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectIsTeacher = (state) => state.user.userType === "teacher";
export const selectIsStudent = (state) => state.user.userType === "student";
