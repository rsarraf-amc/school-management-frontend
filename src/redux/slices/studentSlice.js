import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentsApi } from '../../services/api';
import { studentFromApi } from '../../utils/mappers';

export const fetchStudentProfile = createAsyncThunk(
  'student/fetchProfile',
  async (_studentUserId, thunkAPI) => {
    try {
      // Students are not linked to user accounts in the API, so the profile is matched by e-mail.
      const email = thunkAPI.getState().auth.user?.email;
      const students = (await studentsApi.list() ?? []).map(studentFromApi);
      const profile = students.find((s) => s.email === email);
      if (!profile) throw new Error('Student profile not found');
      return profile;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default studentSlice.reducer;
