import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

export const fetchTeacherClasses = createAsyncThunk(
  'teacher/fetchClasses',
  async (teacherUserId, thunkAPI) => {
    try {
      return await apiService.getTeacherClasses(teacherUserId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  classes: [],
  status: 'idle',
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherClasses.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchTeacherClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default teacherSlice.reducer;
